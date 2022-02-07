import { useState } from 'react';
import { Grid, FormControl, InputLabel, OutlinedInput, Box, Typography, FormHelperText, FormControlLabel, Checkbox } from '@material-ui/core';
import GrayDivider from './grayDivider';
import { useTicketInstanceStore } from 'src/stores';
import { BaseForm, CustomLabel, CustomFormTextField } from 'src/components';
import type { FormFieldValidationProps, RegisterModel, ContactInfoRegisterModel } from 'src/types';
import * as Yup from 'yup';
import { PhoneNumberExpression } from 'src/constants/expressions';
import TextMaskCustom from 'src/components/textMaskCustom';
import { useAuth } from 'src/hooks';

const ContactInfo = () => {

    const { 
        squarePayment, 
        setContactInfo,
    } = useTicketInstanceStore((state) => ({ 
        squarePayment: state.squarePayment,
        setContactInfo: state.setContactInfo,
    }));

    const completeGuestCheckout = async (model: ContactInfoRegisterModel) => {};

    const { isAuthenticated } = useAuth();

    const fanInitialValue = {
        email: '',
        phoneNumber: '',
    };
    
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    
    const squareValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be valid!'),
        phoneNumber: Yup.string()
            .matches(PhoneNumberExpression, 'Must be in format (XXX) XXX-XXXX'),
    });

    const guestValidationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be valid!')
            .required('Email is required'),
        phoneNumber: Yup.string()
            .matches(PhoneNumberExpression, 'Must be in format (XXX) XXX-XXXX'),
        acceptTerms: Yup.boolean()
            .required('The terms and conditions must be accepted.')
            .oneOf([true], 'The terms and conditions must be accepted.'),
    });
    
    const emailHandleBlur = async (e) => {
        setEmail(e.target.value);
        let data = {
            email: e.target.value,
            phoneNumber,
            acceptTerms,
        } as ContactInfoRegisterModel
        setContactInfo(data);
    };

    const phoneHandleBlur = async (e) => {
        setPhoneNumber(e.target.value);
        let contactInfo = {
            email,
            phoneNumber: e.target.value,
            acceptTerms,
        } as ContactInfoRegisterModel
        setContactInfo(contactInfo);
    };

    const acceptTermsHandle = async (e) => {
        setAcceptTerms(e.target.checked);
        let contactInfo = {
            email,
            phoneNumber,
            acceptTerms: e.target.checked,
        } as ContactInfoRegisterModel
        setContactInfo(contactInfo);
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
                                        acceptTermsHandle(e);
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
        <>
            {squarePayment || !isAuthenticated ? (
                <>
                    <Box display="flex" justifyContent="space-between" mx={3}>
                        <Box>
                            <BaseForm<RegisterModel>
                                submitFunc={completeGuestCheckout}
                                initialValue={fanInitialValue}
                                validationSchema={(squarePayment ? squareValidationSchema : guestValidationSchema)}
                            >
                                {(validationProps: FormFieldValidationProps) => (
                                    <Grid
                                        container
                                        spacing={2}
                                    >
                                        <Grid item xs={12}>
                                            {!isAuthenticated ? (
                                                <CustomLabel title="Email Address *" />
                                            ) : (
                                                <CustomLabel title="Email Address" />
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <CustomFormTextField
                                                name="email"
                                                {...validationProps}
                                                customOnBlur={emailHandleBlur}
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
                                                    onBlur={phoneHandleBlur}
                                                />
                                            </FormControl>
                                            { !squarePayment && renderReadTermsAndConditions(validationProps) }
                                        </Grid>

                                    </Grid>
                                )}
                            </BaseForm>
                        </Box>
                    </Box>
                    <GrayDivider />
                </>
            ) : (
                <>
                    
                </>
            )}
        </>
    );
  };
  export default ContactInfo;
  