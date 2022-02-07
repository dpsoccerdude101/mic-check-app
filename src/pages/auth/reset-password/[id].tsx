import { useEffect } from 'react';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import { AuthLayout, BaseForm, CustomFormTextField, CustomLabel } from 'src/components';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { BaseResponse } from 'src/types';
import { useSnackbar } from 'notistack';
import { Api } from 'src/utils';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

const useStyles = makeStyles({
  button: {
    height: 55
  },
  grayText: {
    color: '#A3A3A3',
    fontSize: 16,
    lineHeight: '22px'
  }
});

type ResetPasswordProps = {
  loadResponse: BaseResponse<string>
};

type ResetPasswordModel = {
  pendingResetPasswordId: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

const ResetPassword = ({ loadResponse }: ResetPasswordProps) => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const { message, success } = loadResponse;
    if (!success) {
      enqueueSnackbar(message, { variant: 'error' });
      router.push(UiRoutes.Auth.Login);
    }
  }, []);

  const handleSubmit = async (model: ResetPasswordModel) => {
    const response = await Api.post(ApiRoutes.Account.ResetPassword, model);
    const { message, success } = response;
    if (success) {
      await router.push(UiRoutes.Auth.Login);
    } else { enqueueSnackbar(message, { variant: 'error' }); }
  };

  return (
    <AuthLayout title='Reset Password'>
      <Grid item xs={12}>
        <Typography className={classes.grayText} variant='h3'>
          Please enter a new password.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <BaseForm<ResetPasswordModel> submitFunc={handleSubmit} initialValue={{ pendingResetPasswordId: loadResponse.data, password: '', confirmPassword: '' }} validationSchema={validationSchema}>
          {(validationProps) => (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomLabel title='Password' />
              </Grid>
              <Grid item xs={12}>
                <CustomFormTextField name='password' {...validationProps} extraProps={{ type: 'password' }} />
              </Grid>
              <Grid item xs={12}>
                <CustomLabel title='Confirm Password' />
              </Grid>
              <Grid item xs={12}>
                <CustomFormTextField name='confirmPassword' {...validationProps} extraProps={{ type: 'password' }} />
              </Grid>
              <Grid item xs={12}>
                <Button className={classes.button} variant='contained' color='primary' type='submit'>Save</Button>
              </Grid>
            </Grid>
          )}
        </BaseForm>
      </Grid>
    </AuthLayout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const loadResponse: BaseResponse<string> = await Api.get(ApiRoutes.Account.GetPendingResetPassword(id));
  return { props: { loadResponse } };
}

export default ResetPassword;
