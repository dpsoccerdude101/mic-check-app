import { useState } from 'react';
import {
    Button,
    Grid,
    TextField,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { BaseForm, CustomHookFormTextField, CustomLabel } from 'src/components';
import { DateTimePicker } from '@material-ui/lab';
import * as Yup from 'yup';
import {
    BaseResponse,
    CheckoutRequest,
    FormFieldValidationProps,
    TicketInfo,
} from 'src/types';
import clsx from 'clsx';
import {
    useShowStore,
    useTicketInfoStore,
    useTicketInstanceStore,
} from 'src/stores';
import { CheckoutService, TicketService } from 'src/services';
import { useSnackbar } from 'notistack';
import BillingInfo from 'src/types/order/checkout/billingInfo';
import { useAuth } from 'src/hooks';
import { useRouter } from 'next/router';
import { UiRoutes } from 'src/constants';
import GrayDivider from '../grayDivider';

const validationSchema = Yup.object().shape({
    cardNumber: Yup.string().required(),
    cVV: Yup.string().required(),
    expYear: Yup.string().required(),
    expMonth: Yup.string().required(),
});

const useStyles = makeStyles({
    button: {
        height: '3rem',
        '&.not-selected': {
            borderColor: '#E5E5E5',
        },
    },
});

const BillingInfoForm = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { orderItems, clear, sourceBandId, supportedShowBandIds } =
        useTicketInstanceStore((state) => ({
            orderItems: state.orderItems,
            clear: state.clearOrder,
            sourceBandId: state.sourceBandId,
            supportedShowBandIds: state.supportedShowBandIds,
            paymentDetails: state.paymentDetails,
        }));
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const initialValue = {
        cardNumber: '',
        cVV: '',
        expYear: '',
        expMonth: '',
    };

    const [state, setState] = useState<BillingInfo>(initialValue);

    const submitHandler = async (value: BillingInfo) => {
        console.log('Form submitted');
        if (isAuthenticated) {
            await buyTickets(value);
        } else {
            router.push(UiRoutes.Tickets.GuestCheckout);
        }
    };

    const buyTickets = async (value: BillingInfo) => {
        const request = {
            items: orderItems,
            sourceBandId,
            supportedShowBandIds,
            billingInfo: value,
        } as CheckoutRequest;
        console.log('checkout request: ', request);
        const response = await CheckoutService.checkout(request);
        if (response.success) {
            clear();
            router.push(
                UiRoutes.Tickets.TicketOrderConfirmation(response.data)
            );
        } else {
            enqueueSnackbar(response.message, { variant: 'error' });
        }
    };

    return (
        <>
            <Typography variant="h2" component="span" color="primary" mb={2}>
                Billing Information
            </Typography>
            <BaseForm<BillingInfo>
                submitFunc={submitHandler}
                initialValue={initialValue}
                validationSchema={validationSchema}
                validateOnChange={true}
            >
                {(validationProps: FormFieldValidationProps) => {
                    const { isSubmitting } = validationProps;
                    return (
                        <Grid
                            sx={{ pb: 2 }}
                            container
                            spacing={2}
                            direction="row"
                            alignItems="stretch"
                        >
                            <Grid item xs={12}>
                                <CustomLabel
                                    bold={false}
                                    title="Credit Card Number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomHookFormTextField
                                    {...validationProps}
                                    name="cardNumber"
                                    updateValue={(value) =>
                                        setState({
                                            ...state,
                                            cardNumber: value,
                                        })
                                    }
                                    value={state.cardNumber}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomLabel bold={false} title="CVV" />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomHookFormTextField
                                    {...validationProps}
                                    name="cVV"
                                    updateValue={(value) =>
                                        setState({
                                            ...state,
                                            cVV: value,
                                        })
                                    }
                                    value={state.cVV}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomLabel
                                    bold={false}
                                    title="Expiration Month"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomLabel
                                    bold={false}
                                    title="Expiration Year"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <CustomHookFormTextField
                                    {...validationProps}
                                    name="expMonth"
                                    updateValue={(value) =>
                                        setState({
                                            ...state,
                                            expMonth: value,
                                        })
                                    }
                                    value={state.expMonth}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <CustomHookFormTextField
                                    {...validationProps}
                                    name="expYear"
                                    updateValue={(value) =>
                                        setState({
                                            ...state,
                                            expYear: value,
                                        })
                                    }
                                    value={state.expYear}
                                    extraProps={{
                                        type: 'number',
                                        inputProps: { maxLength: 4 },
                                    }}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="flex-end"
                            >
                                <Button
                                    disabled={isSubmitting}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    sx={{ mt: 2 }}
                                    type="submit"
                                >
                                    {isAuthenticated
                                        ? 'Buy Tickets'
                                        : 'Continue'}
                                </Button>
                            </Grid>
                        </Grid>
                    );
                }}
            </BaseForm>
        </>
    );
};

export default BillingInfoForm;
