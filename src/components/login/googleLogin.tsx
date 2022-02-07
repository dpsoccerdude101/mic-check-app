import Head from 'next/head';
import { GoogleLogin } from 'react-google-login';
import { Button, makeStyles } from '@material-ui/core';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { useAuth, useLogin } from 'src/hooks';
import { ApiRoutes, AppConstants, Colors, UiRoutes } from 'src/constants';
import { useRouter } from 'next/router';
import { BaseResponse, LoginResponse, SocialLoginRequest } from 'src/types';
import { Api } from 'src/utils';

const GOOGLE_APP_ID = process.env.NEXT_PUBLIC_GOOGLE_APP_ID;

const useStyles = makeStyles({
  googleButton: {
    backgroundColor: 'white',
    color: Colors.PRIMARY,
    '&:hover': {
      backgroundColor: 'white'
    }
  },
  googleIcon: {
    height: 30,
    objectFit: 'cover',
    position: 'absolute',
    left: 5,
    bottom: 5
  }
});

type GoogleResponse = {
  tokenId: string;
};

const GoogleLoginComponent = () => {
  const router = useRouter();
  const classes = useStyles();
  const { loading, startLoading, stopLoading } = useLogin();
  const { setToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const tryLoginWithGoogle = async (googleToken: string) => {
    const request: SocialLoginRequest = {
      type: 'GOOGLE',
      accessToken: googleToken
    };

    const baseResponse: BaseResponse = await Api.post(ApiRoutes.Account.SocialLogin, request);
    const { token, message, success } = baseResponse as LoginResponse;
    if (success) {
      if (token) {
        await setToken(token);
      } else {
        Cookies.set(AppConstants.googleTokenLabel, googleToken, { expires: 365 });
        router.push(UiRoutes.Auth.External.FinalStep);
      }
    } else {
      enqueueSnackbar(message, { variant: 'error' });
      stopLoading();
    }
  };

  const onSuccess = async (response: any) => {
    const { tokenId } = response as GoogleResponse;
    await tryLoginWithGoogle(tokenId);
  };

  const onFailure = (error: any) => {
    stopLoading();
    console.log('Error trying to login with google!', error);
  };

  const handleClick = (e: any, callBack: any) => {
    startLoading();
    callBack(e);
  };

  return (
    <>
      <Head>
        <script src='https://accounts.google.com/gsi/client' async defer />
      </Head>
      <GoogleLogin
        clientId={GOOGLE_APP_ID}
        render={(renderProps) => (
          <Button
            fullWidth
            className={classes.googleButton}
            color='primary'
            type='button'
            variant='contained'
            size='large'
            startIcon={<img className={classes.googleIcon} src='/icons/google.png' alt='Google' />}
            onClick={(e) => handleClick(e, renderProps.onClick)}
            disabled={loading || renderProps.disabled}
          >
            Log in with Google
          </Button>
        )}
        icon
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy='single_host_origin'
        isSignedIn={false}
      />
    </>
  );
};

export default GoogleLoginComponent;
