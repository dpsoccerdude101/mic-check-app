import { useCallback, forwardRef, useState } from 'react';
import {
    Button,
    Checkbox,
    Grid,
    FormControl,
    FormControlLabel,
    InputLabel,
    OutlinedInput,
    Typography,
    FormHelperText,
} from '@material-ui/core';
import { isMobile } from 'react-device-detect';
import MaskedInput from 'react-text-mask';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import {
    AuthLayout,
    BaseForm,
    CustomLabel,
    CustomFormTextField,
    UserTypeSwitcher,
} from 'src/components';
import { useSnackbar } from 'notistack';
import TrackService from 'src/services/trackService';
import { ApiRoutes, TrackActions, UiRoutes } from 'src/constants';
import { PhoneNumberExpression } from 'src/constants/expressions';
import {
    BandRegisterModel,
    RegisterModel,
    FormFieldValidationProps,
    FanRegisterModel,
    BaseResponse,
    UserTypeEnum,
} from 'src/types';
import clsx from 'clsx';
import * as Yup from 'yup';
import Link from 'next/link';
import api from 'src/utils/api';
import TextMaskCustom from 'src/components/textMaskCustom';
import { useLayout } from 'src/hooks';

const useStyles = makeStyles({
    blue: {
        backgroundColor: '#3F8CFF',
    },
    innerGrid: {
        marginLeft: 10,
        marginTop: 5,
        paddingRight: 20,
    },
    smallText: {
        fontSize: '.8rem',
        whiteSpace: 'nowrap',
    },
    topSpace: {
        paddingTop: 25,
    },
    verticalSpace: {
        paddingTop: '15px !important',
    },
});

const bandInitialValue = {
    email: '',
    name: '',
    isMobile,
    phoneNumber: '',
    acceptTerms: false,
};

const fanInitialValue = {
    email: '',
    isMobile,
    phoneNumber: '',
    acceptTerms: false,
};

const fanValidationSchema = Yup.object().shape({
    acceptTerms: Yup.boolean()
        .required('The terms and conditions must be accepted.')
        .oneOf([true], 'The terms and conditions must be accepted.'),
    email: Yup.string()
        .email('Email must be valid!')
        .required('Email is required'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(PhoneNumberExpression, 'Must be in format (XXX) XXX-XXXX'),
});

const bandValidationSchema = fanValidationSchema.concat(
    Yup.object().shape({ name: Yup.string().required('Name is required') })
);

// export const TextMaskCustom = forwardRef<HTMLElement>((
//   props,
//   ref,
// ) => {
//   const setRef = useCallback(
//     (maskedInputRef: { inputElement: HTMLElement } | null) => {
//       const value = maskedInputRef ? maskedInputRef.inputElement : null;
//       if (typeof ref === 'function') {
//         ref(value);
//       } else if (ref) {
//         ref.current = value;
//       }
//     },
//     [ref],
//   );

//   return (
//     <MaskedInput
//       {...props}
//       ref={setRef}
//       mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
//       placeholderChar={'\u2000'}
//       showMask
//     />
//   );
// });

export default function SignUp() {
    useLayout('simple');
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userType, setUserType] = useState<UserTypeEnum>(UserTypeEnum.Band);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const proceed = (validationId: string, isFan: boolean) => {
        if (isMobile) {
            if (isFan) {
                router.push(UiRoutes.Auth.ValidateFanCode(validationId));
            } else {
                router.push(UiRoutes.Auth.ValidateBandMemberCode(validationId));
            }
        } else {
            if (isFan) {
                router.push(UiRoutes.Auth.VerifyFanEmail(validationId));
            } else {
                router.push(UiRoutes.Auth.VerifyBandEmail(validationId));
            }
        }
    };

    const registerBand = async (model: BandRegisterModel) => {
        const response: BaseResponse<string> = await api.post(
            ApiRoutes.Bands.Add,
            model
        );
        const { data, message, success } = response;
        if (success) {
            const trackObj = model as any;
            trackObj.userType = 'BAND MEMBER';
            TrackService.trackAction(TrackActions.BAND_CREATED, trackObj, null);
            TrackService.trackAction(
                TrackActions.USER_REGISTERED,
                trackObj,
                null
            );
            proceed(data, false);
        } else {
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const registerFan = async (model: FanRegisterModel) => {
        const response = await api.post(ApiRoutes.Fans.Add, model);
        const { data, message, success } = response;
        if (success) {
            const trackObj = model as any;
            trackObj.userType = 'FAN';
            TrackService.trackAction(
                TrackActions.USER_REGISTERED,
                trackObj,
                null
            );
            proceed(data, true);
        } else {
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const register = async (model: RegisterModel) => {
        model.email = model.email.trim();
        if (userType === UserTypeEnum.Band) {
            await registerBand(model as BandRegisterModel);
        } else {
            await registerFan(model as FanRegisterModel);
        }
    };

    const renderBandNameIfNecessary = (validationProps) => {
        if (userType === UserTypeEnum.Band) {
            return (
                <>
                    <Grid item className={classes.topSpace} xs={12}>
                        <CustomLabel title="Band Name" />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomFormTextField
                            name="name"
                            {...validationProps}
                            extraProps={{ autoComplete: 'off' }}
                        />
                    </Grid>
                </>
            );
        }

        return null;
    };

    const renderReadTermsAndConditions = (validationProps) => {
        const { handleBlur, values, errors, touched } = validationProps;
        const label = (
            <Typography>
                I agree to the{' '}
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.themiccheck.com/terms"
                >
                    Terms and Conditions
                </a>{' '}
                of MicCheck
            </Typography>
        );
        return (
            <>
                <Grid item xs={12}>
                    <FormControl
                        error={Boolean(
                            touched.acceptTerms && errors.acceptTerms
                        )}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    inputProps={{
                                        onBlur: handleBlur,
                                    }}
                                    checked={values.acceptTerms}
                                    onChange={(e) => {
                                        validationProps.setFieldValue(
                                            'acceptTerms',
                                            e.target.checked
                                        );
                                    }}
                                    name="acceptTerms"
                                />
                            }
                            label={label}
                        />
                        <FormHelperText>
                            {touched.acceptTerms && errors.acceptTerms}
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </>
        );
    };

    const isBand = userType === UserTypeEnum.Band;
    const initialValue = isBand ? bandInitialValue : fanInitialValue;
    const validationSchema = isBand
        ? bandValidationSchema
        : fanValidationSchema;

    if (email) {
        initialValue.email = email;
    }
    if (phoneNumber) {
        initialValue.phoneNumber = phoneNumber;
    }

    return (
        <AuthLayout title="Sign up with your email">
            <Grid
                item
                xs={12}
                className={clsx(classes.verticalSpace, classes.smallText)}
            >
                <Link href={UiRoutes.Auth.Login}>
                    Already have an account? Log in.
                </Link>
            </Grid>
            <BaseForm<RegisterModel>
                submitFunc={register}
                initialValue={initialValue}
                validationSchema={validationSchema}
            >
                {(validationProps: FormFieldValidationProps) => (
                    <Grid className={classes.innerGrid} container spacing={2}>
                        <Grid item xs={12}>
                            <CustomLabel title="Email Address" />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomFormTextField
                                name="email"
                                {...validationProps}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomLabel title="Phone Number" />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="formatted-text-mask-input" />
                                <OutlinedInput
                                    onClick={(e) => {
                                        const target = e.target as any;
                                        const digitsLength =
                                            target.value.replace(
                                                /[^0-9]/g,
                                                ''
                                            ).length;
                                        let cursorPosition = 0;
                                        if (digitsLength > 0) {
                                            if (digitsLength < 4) {
                                                cursorPosition =
                                                    digitsLength + 1;
                                            } else if (digitsLength < 7) {
                                                cursorPosition =
                                                    digitsLength + 3;
                                            } else {
                                                cursorPosition =
                                                    digitsLength + 4;
                                            }
                                        }

                                        target.setSelectionRange(
                                            cursorPosition,
                                            cursorPosition
                                        );
                                    }}
                                    disabled={validationProps.isSubmitting}
                                    onBlur={validationProps.handleBlur}
                                    error={Boolean(
                                        validationProps.errors.phoneNumber &&
                                            validationProps.touched.phoneNumber
                                    )}
                                    value={validationProps.values.phoneNumber}
                                    onChange={(e) =>
                                        validationProps.setFieldValue(
                                            'phoneNumber',
                                            e.target.value
                                        )
                                    }
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    inputComponent={TextMaskCustom as any}
                                />
                            </FormControl>
                        </Grid>
                        <UserTypeSwitcher
                            value={userType}
                            handleChange={(value: UserTypeEnum) => {
                                setEmail(validationProps.values.email);
                                setPhoneNumber(
                                    validationProps.values.phoneNumber
                                );
                                setUserType(value);
                            }}
                        />
                        {renderBandNameIfNecessary(validationProps)}
                        {renderReadTermsAndConditions(validationProps)}
                        <Grid item className={classes.topSpace} xs={12}>
                            <Button
                                disabled={validationProps.isSubmitting}
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                            >
                                Continue
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </BaseForm>
        </AuthLayout>
    );
}
