import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import Colors from 'src/constants/colors';
import FinishRegisterModel from 'src/types/auth/finishRegisterModel';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useAuth } from 'src/hooks';
import { UserNameValidationRegex, PasswordValidationRegex } from 'src/constants/expressions';
import { CustomFormTextField, CustomLabel, CustomPaper } from 'src/components';
import FullLineFormField from 'src/components/custom/fullLineFormField';
import Messages from 'src/constants/messages';
import Logo from 'src/components/logo';
import BaseForm from 'src/components/forms/baseForm';

const useStyles = makeStyles({
  root: {
    background: Colors.PRIMARY,
    height: '100%',
    overflowY: 'auto',
    width: '100%',
    textAlign: 'center',
    paddingTop: 15
  },
  button: {
    height: 60
  },
  grid: {
    textAlign: 'left',
  },
  subtitle: {
    color: 'white',
    fontSize: '.8rem',
    fontWeight: 100,
    paddingTop: 15,
    paddingBottom: 30
  },
  papper: {
    paddingTop: 40,
    paddingBottom: 40
  },
  title: {
    color: 'white',
    fontSize: '1.8rem',
    paddingTop: 5
  }
});
const requiredMessage = Messages.Forms.FieldRequired;
const initialValue: FinishRegisterModel = {
  username: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: ''
};

const validationSchema = Yup.object().shape({
  username: Yup
    .string()
    .required(requiredMessage('username'))
    .matches(UserNameValidationRegex, 'Username can only contain letters and numbers'),
  firstName: Yup.string().required(requiredMessage('first name')),
  password: Yup
    .string()
    .required(requiredMessage('password'))
    .matches(PasswordValidationRegex, 'Password must have at least 6 characters, one digit, one uppercase and one special character'),
  confirmPassword:
    Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});

type FinishRegistrationProps = {
  isBandMember?: boolean;
  submitFunc: (model: FinishRegisterModel) => Promise<void>;
};

const FinishRegistration = ({ isBandMember = false, submitFunc }: FinishRegistrationProps) => {
  const classes = useStyles();
  const { isAuthenticated } = useAuth();
  const submitRegistration = async (values: FinishRegisterModel) => {
    await submitFunc(values);
  };
  const userNameLabel = isBandMember ? 'Band Member Username' : 'Username';
  return (
    isAuthenticated ? null
      : (
        <div className={classes.root}>
          <Logo width={270} height={65} />
          <Typography variant='h1' className={classes.title}>Almost there!</Typography>
          <Typography variant='h2' className={classes.subtitle}>Just a few more details to finish creating your account.</Typography>
          <Grid container>
            <Grid item lg={4} />
            <Grid item xs={12} lg={4}>
              <CustomPaper className={classes.papper}>
                <BaseForm<FinishRegisterModel> submitFunc={submitRegistration} initialValue={initialValue} validationSchema={validationSchema}>
                  {(validationProps) => (
                    <Grid className={classes.grid} container spacing={2}>
                      <FullLineFormField label={userNameLabel} name='username' {...validationProps} />
                      <Grid item xs={6}>
                        <CustomLabel title='First Name' />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomLabel title='Last Name' />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomFormTextField name='firstName' {...validationProps} />
                      </Grid>
                      <Grid item xs={6}>
                        <CustomFormTextField name='lastName' {...validationProps} />
                      </Grid>
                      <FullLineFormField label='Password' name='password' {...validationProps} extraProps={{ type: 'password' }} />
                      <FullLineFormField label='Confirm Password' name='confirmPassword' {...validationProps} extraProps={{ type: 'password' }} />
                      <Grid item xs={12}>
                        <Button disabled={validationProps.isSubmitting} className={classes.button} variant='contained' type='submit' color='primary' fullWidth>Continue</Button>
                      </Grid>
                    </Grid>
                  )}

                </BaseForm>
              </CustomPaper>
            </Grid>
          </Grid>
        </div>
      )
  );
};

FinishRegistration.propTypes = {
  isBandMember: PropTypes.bool,
  submitFunc: PropTypes.func.isRequired
};

export default FinishRegistration;
