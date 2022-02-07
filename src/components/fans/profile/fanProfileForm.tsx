import { useEffect, useState } from 'react';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import { BaseForm, CustomFileUpload, CustomLabel, CustomFormTextField } from 'src/components';
import { ApiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import type { BaseResponse, FormFieldValidationProps, FileModel, FanProfile } from 'src/types';

const initialValue: FanProfile = {
  id: '',
  userName: '',
  name: '',
  surname: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  profilePicturePath: '',
  profilePicture: null
};

const validationSchema = Yup
  .object()
  .shape({
    name: Yup
      .string()
      .max(100)
      .required('First name is required'),
    surname: Yup
      .string()
      .max(100)
      .required('Last name is required'),
    currentPassword: Yup.string().nullable()
      .when('newPassword', {
        is: (value) => value && value.length > 0,
        then: Yup.string().required('Current password is required!')
      }),
    newPassword: Yup.string().nullable()
      .when('currentPassword', {
        is: (currentPassword) => currentPassword && currentPassword.length > 0,
        then: Yup.string().nullable().required('New password is required!')
      }),
    confirmPassword:
      Yup.string().nullable()
        .when('newPassword', {
          is: (value) => value && value.length > 0,
          then: Yup.string().required('Confirm password is required!')
        })
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  }, [['currentPassword', 'newPassword'], ['newPassword', 'confirmPassword']]);

type FanProfileFormProps = {
  fan: FanProfile;
};

const useStyles = makeStyles((theme) => ({
  uploadGrid: {
    [theme.breakpoints.down('lg')]: {
      height: '25.5vh'
    }
  }
}));

const FanProfileForm = ({ fan }: FanProfileFormProps) => {
  const [fileModel, setFileModel] = useState(null);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    async function renderImage() {
      const { id } = fan;
      const imageFileModel: FileModel = {
        srcString: ApiRoutes.Files.GetFanPicture(id)
      };
      setFileModel(imageFileModel);
    }
    if (fan) {
      renderImage();
    }
  }, [fan]);
  const loadFileModel = (file: FileModel) => {
    setFileModel(file);
  };
  const prepareObj = (values: FanProfile): FanProfile => {
    values.profilePicture = fileModel;
    values.id = fan.id;
    values.currentPassword = values.currentPassword !== '' ? values.currentPassword : null;
    values.newPassword = values.newPassword !== '' ? values.newPassword : null;
    values.confirmPassword = values.confirmPassword !== '' ? values.confirmPassword : null;
    return values;
  };
  const submitFanProfile = async (values: FanProfile) => {
    values = prepareObj(values);
    let response: BaseResponse<FanProfile> = null;
    response = await Api.put(ApiRoutes.Fans.UpdateProfile(values.id), values);
    const { success, message } = response;
    if (!success && message) {
      enqueueSnackbar(message, { variant: 'error' });
    }
  };
  return (
    <BaseForm<FanProfile> submitFunc={submitFanProfile} initialValue={fan || initialValue} validationSchema={validationSchema}>
      {(validationProps: FormFieldValidationProps) => {
        const { isSubmitting } = validationProps;
        return (
          <Grid sx={{ pb: 2 }} container spacing={3} direction='row' alignItems='stretch'>
            <Grid item xs={4} sm={6} md={8} lg={9} style={{ alignItems: 'center', display: 'flex' }}>
              <Typography variant='h1'>
                Profile
              </Typography>
            </Grid>
            <Grid item xs={8} sm={6} md={4} lg={3} style={{ textAlign: 'right' }}>
              <Button
                disabled={isSubmitting}
                type='submit'
                size='large'
                variant='contained'
                style={{ paddingBottom: 10, paddingTop: 5 }}
                fullWidth
              >
                Save Changes
              </Button>
            </Grid>
            <Grid className={classes.uploadGrid} item xs={12} md={4} lg={4}>
              <Grid style={{ height: '100%' }}>
                <CustomFileUpload label='Profile Picture' imgSrc={fileModel ? fileModel.srcString : ''} setFileModel={loadFileModel} />
              </Grid>
            </Grid>
            <Grid item xs={12} md={8} lg={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}><CustomLabel title='Username' /></Grid>
                <Grid item xs={12}>
                  <CustomFormTextField
                    {...validationProps}
                    name='userName'
                    extraProps={{ disabled: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomLabel title='First Name' />
                </Grid>
                <Grid item xs={6}>
                  <CustomLabel title='Last Name' />
                </Grid>
                <Grid item xs={6}>
                  <CustomFormTextField
                    {...validationProps}
                    name='name'
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomFormTextField
                    {...validationProps}
                    name='surname'
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid sx={{ display: { xs: 'none', md: 'block' } }} item md={4} />
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}><CustomLabel title='Email Address' /></Grid>
                <Grid item xs={12}>
                  <CustomFormTextField
                    {...validationProps}
                    name='email'
                    extraProps={{ disabled: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h2'>Change Password</Typography>
                </Grid>
                <Grid item xs={12}><CustomLabel title='Current Password' /></Grid>
                <Grid item xs={12}>
                  <CustomFormTextField
                    {...validationProps}
                    name='currentPassword'
                    extraProps={{ type: 'password' }}
                  />
                </Grid>
                <Grid item xs={12}><CustomLabel title='New Password' /></Grid>
                <Grid item xs={12}>
                  <CustomFormTextField
                    {...validationProps}
                    name='newPassword'
                    extraProps={{ type: 'password' }}
                  />
                </Grid>
                <Grid item xs={12}><CustomLabel title='Confirm Password' /></Grid>
                <Grid item xs={12}>
                  <CustomFormTextField
                    {...validationProps}
                    name='confirmPassword'
                    extraProps={{ type: 'password' }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      }}
    </BaseForm>
  );
};

FanProfileForm.propTypes = {
  fan: PropTypes.any.isRequired
};

export default FanProfileForm;
