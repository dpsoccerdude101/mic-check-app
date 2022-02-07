import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Cookies from 'js-cookie';
import { ApiRoutes, AppConstants, UiRoutes } from 'src/constants';
import { FacebookProvider, Login } from 'react-facebook';
import { useRouter } from 'next/router';
import { Helper, Api } from 'src/utils';
import { useSnackbar } from 'notistack';
import { useLogin } from 'src/hooks';
import type { BaseResponse, LoginResponse, SocialProviderEnum } from 'src/types';
import useAuth from '../../hooks/useAuth';

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;

const useStyles = makeStyles({
  facebookButton: {
    backgroundColor: '#1877F2',
    '&:hover': {
      backgroundColor: '#1877F2'
    }
  },
  facebookIcon: {
    height: 30,
    width: 30,
    objectFit: 'contain',
    position: 'absolute',
    left: 5,
    bottom: 5
  }
});

type SocialLoginRequest = {
  type: SocialProviderEnum,
  accessToken: string
};

type FacebookTokenDetails = {
  accessToken: string;
};

type FacebookResponse = {
  tokenDetail: FacebookTokenDetails;
};

const FacebookLogin = () => {
  const classes = useStyles();
  const router = useRouter();
  const [fbAccessToken, setFbAccessToken] = useState('');
  const { setToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, startLoading, stopLoading } = useLogin();

  useEffect(() => {
    const waitForFB = async () => {
      let fbLib = (window as any).FB;
      if (fbLib) return;
      for (let i = 0; i < 5; i++) {
        // eslint-disable-next-line no-await-in-loop
        await Helper.wait(2);
        fbLib = (window as any).FB;
        if (fbLib) { return; }
      }
    };

    const checkIfIsLoggedOnFB = async () => {
      await waitForFB();
      (window as any).FB.getLoginStatus((response: any) => {
        if (response.status === 'connected') {
          const { accessToken } = response.authResponse;
          setFbAccessToken(accessToken);
        }
      });
    };
    checkIfIsLoggedOnFB();
  }, []);

  const tryLoginWithFacebook = async (accessToken: string) => {
    const request: SocialLoginRequest = {
      type: 'FACEBOOK',
      accessToken
    };
    const baseResponse: BaseResponse = await Api.post(ApiRoutes.Account.SocialLogin, request);
    const { token, message, success } = baseResponse as LoginResponse;
    if (success) {
      if (token) {
        await setToken(token);
      } else {
        Cookies.set(AppConstants.facebookAccessTokenLabel, accessToken, { expires: 365 });
        router.push(UiRoutes.Auth.External.FinalStep);
      }
    } else {
      enqueueSnackbar(message, { variant: 'error' });
      stopLoading();
    }
  };

  const handleError = (err) => {
    stopLoading();
    console.log(`Facebook error:${err}`);
  };

  const handleCompleted = async (response: FacebookResponse) => {
    if (response) {
      const { tokenDetail } = response;
      const { accessToken } = tokenDetail;
      if (accessToken) {
        await tryLoginWithFacebook(accessToken);
      }
    }
  };

  const handleButtonClick = async (e: any, callback: any) => {
    startLoading();
    if (fbAccessToken) {
      await tryLoginWithFacebook(fbAccessToken);
    } else {
      callback(e);
    }
  };

  return (
    <FacebookProvider appId={FB_APP_ID}>

      <Login scope='email, public_profile' onError={handleError} onCompleted={handleCompleted}>
        {({ loading: fbLogin, handleClick, error, data }) => (
          <Button
            fullWidth
            startIcon={<img className={classes.facebookIcon} src='/icons/facebook-white.png' alt='Facebook' />}
            className={classes.facebookButton}
            onClick={(e) => handleButtonClick(e, handleClick)}
            disabled={loading || fbLogin}
            type='button'
            variant='contained'
            size='large'
          >
            Log in with Facebook
          </Button>
        )}
      </Login>
    </FacebookProvider>

  );
};

export default FacebookLogin;
