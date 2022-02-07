import { useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AuthLayout, BaseForm, CustomFormTextField, CustomLabel } from 'src/components';
import * as Yup from 'yup';
import { ApiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import { useSnackbar } from 'notistack';
import type { BaseResponse, FormFieldValidationProps } from 'src/types';

const useStyles = makeStyles({
  button: {
    height: 55
  },
  grayText: {
    color: '#A3A3A3',
    fontSize: 16,
    lineHeight: '22px'
  },
  subtitle: {
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '22px'
  },
});

const validationSchema = Yup
  .object()
  .shape({
    email: Yup.string().email().required('Email is required!')
  });

type ForgotPasswordModel = {
  email: string
};

export default function ForgotPassword() {
  const classes = useStyles();
  const [sent, setSent] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleSubmit = async ({ email }: ForgotPasswordModel) => {
    const request = { email };
    const response: BaseResponse = await Api.post(ApiRoutes.Account.ForgotPassword, request);
    const { message, success } = response;
    if (success) {
      setSent(true);
    } else { enqueueSnackbar(message, { variant: 'error' }); }
  };

  const renderSentMessage = () => (
    <>
      <Grid item xs={12}>
        <Typography className={classes.subtitle} variant='h2'>
          Check your email and click the link to finish reseting your password.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.grayText} variant='h3'>
          Didn&apos;t receive the email? Check your spam folder.
        </Typography>
      </Grid>
    </>
  );

  const renderForgotPasswordForm = () => (
    <Grid item xs={12}>
      <BaseForm<ForgotPasswordModel> submitFunc={handleSubmit} initialValue={{ email: '' }} validationSchema={validationSchema}>
        {(validationProps: FormFieldValidationProps) => (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomLabel title='Enter your email address' />
            </Grid>
            <Grid item xs={12}>
              <CustomFormTextField name='email' {...validationProps} />
            </Grid>
            <Grid item xs={12}>
              <Button className={classes.button} variant='contained' color='primary' type='submit'>Send</Button>
            </Grid>
          </Grid>
        )}
      </BaseForm>
    </Grid>
  );

  return (
    <AuthLayout title='Forgot your password?' subtitle='Enter your email address. We’ll email you a link to reset your password.'>
      {sent ? renderSentMessage() : renderForgotPasswordForm()}
    </AuthLayout>
  );
}
