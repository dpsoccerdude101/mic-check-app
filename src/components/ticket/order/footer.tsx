import { Button, Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UiRoutes } from 'src/constants';
import { useAuth } from 'src/hooks';
import { useTicketInstanceStore } from 'src/stores';
import { ApiRoutes } from 'src/constants';
import api from 'src/utils/api';
import TerminalCheckout from './terminalCheckout';
import PayPal from './payPal';
import type { Show, BaseResponse, SquareCheckoutRequest, CheckoutRequest, GuestCheckoutRequest } from 'src/types';
import checkoutService from 'src/services/checkoutService';
import { useSnackbar } from 'notistack';

type DetailsProps = {
    show?: Show;
  };

const TicketFooter = ({ show }: DetailsProps) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const {
        orderItems,
        paymentDetails,
        squarePayment,
        checkOutOpen,
        checkOutSuccess,
        sourceBandId,
        supportedShowBandIds,
        contactInfo,
        setCheckOutOpen,
        setCheckOutSuccess,
        setContactInfo,
    } = useTicketInstanceStore((state) => ({
        orderItems: state.orderItems,
        paymentDetails: state.paymentDetails,
        squarePayment: state.squarePayment,
        checkOutOpen: state.checkOutOpen,
        checkOutSuccess: state.checkOutSuccess,
        sourceBandId: state.sourceBandId,
        supportedShowBandIds: state.supportedShowBandIds,
        contactInfo: state.contactInfo,
        setCheckOutOpen: state.setCheckOutOpen,
        setCheckOutSuccess: state.setCheckOutSuccess,
        setContactInfo: state.setContactInfo,
    }));
    
    const { isAuthenticated } = useAuth();
    const [requiresPayment, setRequiresPayment] = useState(false);
    const [lastLog, setLastLog] = useState('');
    const [orderId, setOrderId] = useState('');
    const [checkoutDisabled, setCheckoutDisabled] = useState(false);

    let intervalRef;
    useEffect(() => {
        if (squarePayment) intervalRef = setInterval(timer, 5000);
      return () => clearInterval(intervalRef);
    }, [lastLog, orderId, checkOutSuccess, setCheckOutSuccess]);

    useEffect(() => {
        let requiresPayment = false;
        
        if (paymentDetails) {
            // when a quantity for certain ticket has been selected
            // then check that the total is greater than 0 and there are indeed some ticket with price
            // greater than 0
            requiresPayment = paymentDetails.total > 0 && show.ticketInfos.some(ticket => ticket.price > 0);
        } else {
            // when page first load, then check whether tickets price are greater than 0
            // to display paypal button or just checkout
            requiresPayment = show.ticketInfos.some(ticket => ticket.price > 0);
        }
        
        setRequiresPayment(requiresPayment);
    }, [paymentDetails]);

    const timer = async () => {
        const response: BaseResponse<string> = await api.get(ApiRoutes.SquareLog.GetAll(show.id));
        if (typeof response.data === 'string') {
            if (lastLog == '') {
                setLastLog(response.data);
            }
            else if (lastLog != response.data) {
                if (response.data.includes('CANCELED')) {
                    setCheckOutSuccess(false);
                }
                else if (response.data.includes('COMPLETED')) {
                    setCheckOutSuccess(true);
                }
                setLastLog(response.data);
            }
        }
    };

    const terminalCheckoutClick = async (event) => {
        event.stopPropagation();
        
        let request = {
            items: orderItems,
            sourceBandId,
            supportedShowBandIds,
            amount: paymentDetails.total,
            showId: show.id,
            email: contactInfo.email,
            phoneNumber: contactInfo.phoneNumber,
        } as SquareCheckoutRequest;

        const response = await checkoutService.squareCheckout(request);
        if (!response.success) {
            enqueueSnackbar(response.message, { variant: 'error' });
            return;
        }
        
        setOrderId(response.data);
        setCheckOutSuccess(null);
        setCheckOutOpen(true);
    };

    const freeCheckoutClick = async (event) => {
        event.stopPropagation();

        setCheckoutDisabled(true);

        let request = {
            items: orderItems,
            sourceBandId,
            supportedShowBandIds,
        } as CheckoutRequest;

        const apiCall = checkoutService.free;
        var response = await apiCall(request);
        if (response.success) {
            setContactInfo({email:'', phoneNumber:'', acceptTerms:false});
            router.push(
                UiRoutes.Tickets.TicketOrderConfirmation(response.data)
            );
        }
        else {
            setCheckoutDisabled(true);
            enqueueSnackbar(response.message, { variant: 'error' });
        }

    };

    const freeGuestCheckoutClick = async (event) => {
        event.stopPropagation();
        setCheckoutDisabled(true);

        let request = {
            items: orderItems,
            sourceBandId,
            supportedShowBandIds,
            contactInfo
        } as GuestCheckoutRequest;

        const apiCall = checkoutService.guestFree;
        var response = await apiCall(request);
        if (response.success) {
            setContactInfo({email:'', phoneNumber:'', acceptTerms:false});
            router.push(
                UiRoutes.Tickets.TicketOrderConfirmation(response.data)
            );
        }
        else {
            setCheckoutDisabled(true);
            enqueueSnackbar(response.message, { variant: 'error' });
        }
    };

    if (checkOutOpen == false && (checkOutSuccess == true || checkOutSuccess == false)) {
        setCheckOutSuccess(null);
        setCheckOutOpen(false);
        setContactInfo({email:'', phoneNumber:'', acceptTerms:false});
        window.location.reload();
    }

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                px={2}
            >
                <Grid item xs={12} sm={8} md={4} lg={4}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    padding={3}
                >
                    {squarePayment ? (
                        <>
                            {requiresPayment ? (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={orderItems.length === 0}
                                        onClick={(e) => terminalCheckoutClick(e)}
                                    >
                                        Checkout using Square
                                    </Button>
                                    <TerminalCheckout />
                                </>
                            ) : (
                                <>
                                    <h3>Free Ticket</h3>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {isAuthenticated ? (
                                <>
                                    {requiresPayment ? (
                                        <PayPal guestCheckout={false} />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={checkoutDisabled || orderItems.length === 0}
                                            onClick={(e) => freeCheckoutClick(e)}
                                        >
                                            Checkout
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {requiresPayment ? (
                                        <PayPal guestCheckout={true} />
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => freeGuestCheckoutClick(e)}
                                            disabled={
                                                (
                                                    checkoutDisabled
                                                    ||
                                                    (
                                                        (isAuthenticated && orderItems.length === 0)
                                                        ||
                                                        (!isAuthenticated && (orderItems.length === 0 || contactInfo.email === '' || contactInfo.acceptTerms === false))
                                                    )
                                                )
                                            }
                                        >
                                            Checkout
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    )}

                </Grid>
            </Grid>
        </>
    );

};

export default TicketFooter;
