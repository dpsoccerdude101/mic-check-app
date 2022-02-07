/* eslint-disable react/no-unescaped-entities */
import { useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AuthLayout, BaseForm, CustomLabel, CustomFormTextField, EmailInput, FacebookLogin, GoogleLogin } from 'src/components';
import * as Yup from 'yup';
import Link from 'next/link';
import { UiRoutes } from 'src/constants';
import clsx from 'clsx';
import type { FormFieldValidationProps, LoginModel } from 'src/types';
import { useLogin } from 'src/hooks';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles({
  blue: {
    backgroundColor: '#3F8CFF',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    '&:hover': {
      backgroundColor: '#1877F2'
    }
  },
  innerGrid: {
    marginLeft: 10,
    marginTop: 10,
    paddingRight: 20
  },
  smallFont: {
    fontSize: '.8rem'
  },
  textRight: {
    textAlign: 'right'
  },
  verticalSpace: {
    paddingTop: '12px !important',
    paddingBottom: 5
  },
  paddingBottom15: {
    paddingBottom: 15
  },
});

const validationSchema = Yup
  .object()
  .shape({
    email: Yup.string().email().required(),
    password: Yup.string().required()
  });

export default function LoginComponents() {
  const classes = useStyles();
  const { login, isAuthenticated, goHome } = useAuth() as any;
  const { loading, startLoading, stopLoading } = useLogin();

  useEffect(() => {
    if (isAuthenticated) {
      goHome();
    }
  }, []);

  const authenticate = async ({ email, password }: LoginModel) => {
    startLoading();
    email = email.trim();
    await login(email, password);
    stopLoading();
  };

  return (
    <AuthLayout title='Log in with your email'>
      <Grid item xs={12} className={clsx(classes.smallFont, classes.verticalSpace)}>
        <Link href={UiRoutes.Auth.Register}>Don't have an account yet? Sign up now.</Link>
      </Grid>
      <BaseForm<LoginModel> submitFunc={authenticate} initialValue={{ email: '', password: '' }} validationSchema={validationSchema}>
        {(validationProps: FormFieldValidationProps) => (
          <Grid className={classes.innerGrid} container spacing={2}>
            <Grid item xs={12}>
              <CustomLabel title='Email Address' />
            </Grid>
            <Grid item xs={12}>
              <EmailInput validationProps={validationProps} />
            </Grid>
            <Grid item xs={12}>
              <CustomLabel title='Password' />
            </Grid>
            <Grid item xs={12}>
              <CustomFormTextField extraProps={{ type: 'password' }} name='password' {...validationProps} />
            </Grid>
            <Grid item xs={12} className={clsx(classes.smallFont, classes.textRight, classes.paddingBottom15)}>
              <Link href={UiRoutes.Auth.ForgotPassword}>Forgot your password?</Link>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                disabled={loading || validationProps.isSubmitting}
                type='submit'
                variant='contained'
                size='large'
              >
                Continue
              </Button>
            </Grid>
            <Grid item xs={12}>
              <FacebookLogin />
            </Grid>
            <Grid item xs={12}>
              <GoogleLogin />
            </Grid>
          </Grid>
        )}
      </BaseForm>
    </AuthLayout>
  );
}
