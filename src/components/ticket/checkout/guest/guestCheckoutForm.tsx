import { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    Typography,
    makeStyles,
    Link,
    FormControl,
    InputLabel,
    OutlinedInput,
    FormControlLabel,
    Checkbox,
    FormHelperText,
    Box,
} from '@material-ui/core';
import {
    BaseForm,
    CustomFileUpload,
    CustomLabel,
    CustomFormTextField,
    GuestCheckoutHeader,
} from 'src/components';
import { ApiRoutes, Images, TrackActions, UiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import type {
    BaseResponse,
    FormFieldValidationProps,
    FileModel,
    FanProfile,
    ContactInfoRegisterModel,
    RegisterModel,
} from 'src/types';
import AuthLayout from 'src/components/layouts/authLayout';
import { CheckoutService, TicketService, TrackService } from 'src/services';
import api from 'src/utils/api';
import { isMobile } from 'react-device-detect';
import { PhoneNumberExpression } from 'src/constants/expressions';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import TextMaskCustom from 'src/components/textMaskCustom';
import { useTicketInstanceStore } from 'src/stores';
import SmallContentBodyLayout from 'src/components/layouts/smallContentBodyLayout';
import PayPal from '../../order/payPal';

const { BackgroundImage } = Images;
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
        // whiteSpace: 'nowrap',
    },
    topSpace: {
        paddingTop: 25,
    },
    verticalSpace: {
        paddingTop: '15px !important',
    },
    bg: {
        zIndex: -1,
    },
});

const fanInitialValue = {
    email: '',
    // isMobile,
    phoneNumber: '',
};

const fanValidationSchema = Yup.object().shape({
    acceptTerms: Yup.boolean()
        .required('The terms and conditions must be accepted.')
        .oneOf([true], 'The terms and conditions must be accepted.'),
    email: Yup.string()
        .email('Email must be valid!')
        .required('Email is required'),
    phoneNumber: Yup.string()
        //.required('Phone number is required')
        .matches(PhoneNumberExpression, 'Must be in format (XXX) XXX-XXXX'),
});

const GuestCheckoutForm = () => {
    const [fileModel, setFileModel] = useState(null);
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();

    const [showPayPal, setShowPayPal] = useState(false);
    const [contactInfoRegisterModel, setContactInfoRegisterModel] =
        useState<ContactInfoRegisterModel>(null);

    const { orderItems, clear, sourceBandId } = useTicketInstanceStore(
        (state) => ({
            orderItems: state.orderItems,
            clear: state.clearOrder,
            sourceBandId: state.sourceBandId,
        })
    );

    // const completeGuestCheckout = async (model: ContactInfoRegisterModel) => {
    //     const request = {
    //         createFanRequest: model,
    //         items: orderItems,
    //         sourceBandId,
    //     };
    //     console.log('guestCheckout request', request);
    //     const response = await CheckoutService.guestCheckout(request);
    //     if (response.success) {
    //         // const trackObj = model as any;
    //         // trackObj.userType = 'FAN';
    //         // TrackService.trackAction(
    //         //     TrackActions.USER_REGISTERED,
    //         //     trackObj,
    //         //     null
    //         // );

    //         clear();
    //         router.push(
    //             UiRoutes.Tickets.TicketOrderConfirmation(
    //                 response.data.ticketInstanceId
    //             )
    //         );
    //     } else {
    //         enqueueSnackbar(response.message, { variant: 'error' });
    //     }
    // };

    const completeGuestCheckout = async (model: ContactInfoRegisterModel) => {
        setContactInfoRegisterModel(model);
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

    return (
        <SmallContentBodyLayout
            title="One last step..."
            subtitle={
                "Let's link your ticket to an account so you access it later!"
            }
        >
            <Box px={2}>
                <BaseForm<RegisterModel>
                    submitFunc={completeGuestCheckout}
                    initialValue={fanInitialValue}
                    validationSchema={fanValidationSchema}
                >
                    {(validationProps: FormFieldValidationProps) => (
                        <Grid
                            className={classes.innerGrid}
                            container
                            spacing={2}
                        >
                            <Grid item xs={12}>
                                <CustomLabel title="Email Address *" />
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
                                            validationProps.errors
                                                .phoneNumber &&
                                                validationProps.touched
                                                    .phoneNumber
                                        )}
                                        value={
                                            validationProps.values.phoneNumber
                                        }
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

                            {renderReadTermsAndConditions(validationProps)}
                            <Grid item className={classes.topSpace} xs={12}>
                                <Button
                                    disabled={validationProps.isSubmitting}
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                >
                                    Compelete Checkout
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </BaseForm>
                {contactInfoRegisterModel && (
                    <Box pl={2} mt={2}>
                        {/* <PayPal contactInfo={contactInfoRegisterModel} /> */}
                    </Box>
                )}
            </Box>
        </SmallContentBodyLayout>
    );
};

GuestCheckoutForm.propTypes = {
    // fan: PropTypes.any.isRequired,
};

export default GuestCheckoutForm;
