import {
    PayPalScriptProvider,
    PayPalButtons,
    FUNDING,
} from '@paypal/react-paypal-js';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { UiRoutes } from 'src/constants';
import { CheckoutService, PaymentService } from 'src/services';
import { useTicketInstanceStore } from 'src/stores';
import {
    CheckoutRequest,
    GuestCheckoutRequest,
} from 'src/types';
import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { CustomLoader } from 'src/components';
import { useAuth } from 'src/hooks';

// TODO: move this
// Sandbox Client Id = AVhtocnCeUuslY6ZbceX9lMzgGT5kMHMJ66cU0JkmtDRVNFLMx6p9WGK9E1KmOe-ifgDO0w6SwvM-5-g
// Live Client id = AWP0oUxWGHSYa7D9Kys8fB2WzsvBjgYs3OK0JhmlQsrL6xdQPvUQp1PB_T7lHcbrHZ6jES5XaD-TW25B

const fundingSources = [FUNDING.PAYPAL, FUNDING.VENMO, FUNDING.CARD];

const PayPal = (props: { guestCheckout?: boolean }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { 
        clear,
        orderItems, 
        sourceBandId, 
        supportedShowBandIds,
        contactInfo,
    } = useTicketInstanceStore((state) => ({
            clear: state.clearOrder,
            orderItems: state.orderItems,
            sourceBandId: state.sourceBandId,
            supportedShowBandIds: state.supportedShowBandIds,
            contactInfo: state.contactInfo,
        }));
    const [clientId, setClientId] = useState(null);
    // const [payPalOrderId, setPayPalOrderId] = useState(null);

    const onApprove = async (data, actions) => {
        console.log('onApprove', data);
        const response = await CheckoutService.confirm(data.orderID);
        if (response.success) {
            clear();
            router.push(
                UiRoutes.Tickets.TicketOrderConfirmation(response.data)
            );
        } else {
            // Will be caught and handled by PayPalButtons onError callback
            throw response.message;
        }
    };

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        (async () => {
            console.log('PayPal: getClientId...');
            const response = await PaymentService.getPayPalClientId();
            if (response.success) {
                console.log('paypal clientId', response.message);
                setClientId(response.message);
            }
        })();
    }, []);

    const createOrderOnServer = async (data) => {

        let req = {
            items: orderItems,
            sourceBandId,
            supportedShowBandIds,
        } as CheckoutRequest | GuestCheckoutRequest;
        if (props.guestCheckout) req = { ...req, contactInfo };

        console.log('req: ', req);

        const apiCall = props.guestCheckout
            ? CheckoutService.guestCheckout2
            : CheckoutService.checkout2;
        var response = await apiCall(req);
        if (!response.success) {
            // Will be caught and handled by PayPalButtons onError callback
            throw response.message;
        }
        const payPalOrderId = response.data;
        
        console.log('PayPal: Created Order Id: ', payPalOrderId);
        return Promise.resolve(payPalOrderId);
    };

    const onCancel = async (data, actions) => {
        console.log('PayPal: Cancelled Order Id:', data.orderID, actions);
        await CheckoutService.cancel(data.orderID);
    };

    return clientId ? (
        <PayPalScriptProvider
            options={{
                'client-id': clientId,
                'enable-funding': fundingSources.join(','),
            }}
        >
            {fundingSources.map((fundingSource, index) => (
                <Grid
                    key={index}
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                >
                    <Grid item xs={12} md={6} lg={4} mb={1}>
                        <PayPalButtons
                            style={{ layout: 'horizontal', color: 'white' }}
                            fundingSource={fundingSource}
                            onApprove={onApprove}
                            onCancel={onCancel}
                            onError={(err) =>
                                enqueueSnackbar(err, { variant: 'error' })
                            }
                            createOrder={(data) => createOrderOnServer(data)}
                            disabled={
                                (isAuthenticated && orderItems.length === 0)
                                ||
                                (!isAuthenticated && (orderItems.length === 0 || contactInfo.email === '' || contactInfo.acceptTerms === false))
                            }
                            forceReRender={[orderItems, sourceBandId, supportedShowBandIds, contactInfo]}
                        />
                    </Grid>
                </Grid>
            ))}
        </PayPalScriptProvider>
    ) : (
        <CustomLoader paddingTop="0" />
    );
};

export default PayPal;
