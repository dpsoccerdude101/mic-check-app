import { useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Grid } from '@material-ui/core';
import { AuthLayout, BaseForm, UserTypeSwitcher, CustomLabel, CustomFormTextField } from 'src/components';
import { ApiRoutes, AppConstants, UiRoutes } from 'src/constants';
import { BaseResponse, FormFieldValidationProps, SocialProviderEnum, UserTypeEnum } from 'src/types';
import { useAuth } from 'src/hooks';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import * as Yup from 'yup';
import { NextPageContext } from 'next';
import { UserNameValidationRegex } from 'src/constants/expressions';
import { Api } from 'src/utils';

type SocialRegisterRequest = {
  type: SocialProviderEnum,
  accessToken: string,
  username: string
};

type BandSocialRegisterRequest = SocialRegisterRequest & {
  name: string
};

type FanFinalStepForm = {
  username: string;
};
type BandFinalStepForm = FanFinalStepForm & {
  name: string;
};
type FinalStepForm = BandFinalStepForm | FanFinalStepForm;

const fanInitialValue = {
  username: ''
};

const bandInitialValue = {
  username: '',
  name: ''
};

const fanValidationSchema = Yup
  .object()
  .shape({
    username:
      Yup
        .string()
        .required('Username is required')
        .matches(UserNameValidationRegex, 'Username can only contain letters or digits')
  });

const bandValidationSchema = fanValidationSchema
  .concat(Yup.object().shape({ name: Yup.string().required('Name is required!') }));

type FinalStepProps = {
  accessToken: string;
  type: SocialProviderEnum;
};

const FinalStep = ({ accessToken, type }: FinalStepProps) => {
  const [userType, setUserType] = useState<UserTypeEnum>(UserTypeEnum.Band);
  const [username, setUsername] = useState<string>('');
  const { setToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const renderBandNameIfNeeded = (validationProps: FormFieldValidationProps) => {
    if (userType === UserTypeEnum.Fan) return null;
    return (
      <>
        <Grid item xs={12}>
          <CustomLabel title='Band name' />
        </Grid>
        <Grid item xs={12}>
          <CustomFormTextField name='name' {...validationProps} />
        </Grid>
      </>
    );
  };

  const handleSwitch = (newUserType: UserTypeEnum, currentUsername: string) => {
    setUsername(currentUsername);
    setUserType(newUserType);
  };

  const processResponse = async (response: BaseResponse<string>) => {
    const { data, message, success } = response;
    if (success) {
      const token = data;
      await setToken(token);
    } else {
      Cookies.remove(AppConstants.facebookAccessTokenLabel);
      // Cookies.remove(AppConstants.googleAccessTokenLabel);

      enqueueSnackbar(message, { variant: 'error' });
      await router.push(UiRoutes.Auth.Login);
    }
  };
  const registerSocialFan = async (model: FanFinalStepForm) => {
    const request: SocialRegisterRequest = {
      type,
      accessToken,
      username: model.username
    };

    const response: BaseResponse<string> = await Api.post(ApiRoutes.Fans.RegisterSocial, request);
    await processResponse(response);
  };

  const registerSocialBand = async (model: BandFinalStepForm) => {
    const request: BandSocialRegisterRequest = {
      type,
      accessToken,
      username: model.username,
      name: model.name
    };

    const response: BaseResponse<string> = await Api.post(ApiRoutes.Bands.RegisterSocial, request);
    await processResponse(response);
  };

  const handleSubmit = async (model: FinalStepForm) => {
    if (userType === UserTypeEnum.Fan) {
      await registerSocialFan(model as FanFinalStepForm);
    } else {
      await registerSocialBand(model as BandFinalStepForm);
    }
  };

  const initialValue = userType === UserTypeEnum.Fan ? fanInitialValue : bandInitialValue;
  initialValue.username = username;
  const validationSchema = userType === UserTypeEnum.Fan ? fanValidationSchema : bandValidationSchema;

  return (
    <AuthLayout title='Almost there...'>
      <Grid item xs={12}>
        <BaseForm<FinalStepForm> submitFunc={handleSubmit} initialValue={initialValue} validationSchema={validationSchema}>
          {(validationProps: FormFieldValidationProps) => (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomLabel title='Username' />
              </Grid>
              <Grid item xs={12}>
                <CustomFormTextField name='username' {...validationProps} />
              </Grid>
              <UserTypeSwitcher
                value={userType}
                handleChange={
                  (value: UserTypeEnum) => handleSwitch(value, validationProps.values.username)
                }
              />
              {renderBandNameIfNeeded(validationProps)}
              <Grid item xs={12}>
                <Button fullWidth disabled={validationProps.isSubmitting} variant='contained' type='submit' color='primary'>
                  Register
                </Button>
              </Grid>
            </Grid>
          )}
        </BaseForm>
      </Grid>
    </AuthLayout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const parsedCookies = nookies.get(context);
  const fbToken = parsedCookies[AppConstants.facebookAccessTokenLabel];
  if (fbToken) {
    return {
      props: {
        accessToken: fbToken,
        type: 'FACEBOOK'
      }
    };
  }

  const googleToken = parsedCookies[AppConstants.googleTokenLabel];
  if (googleToken) {
    return {
      props: {
        accessToken: googleToken,
        type: 'GOOGLE'
      }
    };
  }

  return {
    redirect: {
      destination: UiRoutes.Auth.Login,
      permanent: false
    }
  };
}

export default FinalStep;
