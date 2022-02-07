import { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Typography } from '@material-ui/core';
import { useTicketInstanceStore } from 'src/stores';
import { TicketOrderItem } from 'src/types';
import { Formatter } from 'src/utils';
import { CartService } from 'src/services';
import PaymentDetails from 'src/types/order/cart/paymentDetails';
import Cart from 'src/types/order/cart/cart';
import { useSnackbar } from 'notistack';

type ItemRowProps = {
    item: TicketOrderItem;
};

const ItemRow = ({ item }: ItemRowProps) => {
    const { name, quantity, price } = item;
    return (
        <Box
            display="flex"
            width="100%"
            alignItems="center"
            sx={{ pt: 1 }}
            justifyContent="space-between"
        >
            <Typography variant="body2" component="span" color="primary">
                {name}
            </Typography>
            <Box display="flex" alignItems="center">
                <Box mr={2}>
                    <Chip label={quantity} variant="outlined" />
                </Box>
                <Typography>{Formatter.formatMoney(price)}</Typography>
            </Box>
        </Box>
    );
};

const DetailRow = ({
    itemName,
    price,
}: {
    itemName: string;
    price: number;
}) => {
    return (
        <Box
            display="flex"
            width="100%"
            alignItems="center"
            sx={{ pt: 1 }}
            justifyContent="space-between"
        >
            <Typography variant="body2" component="span" color="primary">
                {itemName}
            </Typography>
            <Typography>{Formatter.formatMoney(price)}</Typography>
        </Box>
    );
};

const OrderDetails = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { orderItems, paymentDetails, setPaymentDetails, squarePayment } =
        useTicketInstanceStore((state) => ({
            orderItems: state.orderItems,
            paymentDetails: state.paymentDetails,
            setPaymentDetails: state.setPaymentDetails,
            squarePayment: state.squarePayment,
        }));

    const filteredItems = useMemo(
        () => orderItems.filter((el) => el.quantity > 0),
        [orderItems]
    );
    //const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(null);

    useEffect(() => {
        (async () => {
            // const cart = { items: orderItems } as Cart;
            let response = await CartService.getCart(orderItems, squarePayment);
            if (response.success) {
                const cart = response.data;
                console.log('cart', cart);
                setPaymentDetails(response.data.paymentDetails);

                // response = await CartService.calculatePayment(cart);
                // if (response.success) {
                //     console.log('paymentDetails', response.data.paymentDetails);
                //     setPaymentDetails(response.data.paymentDetails);
                // } else {
                //     enqueueSnackbar(response.message, { variant: 'error' });
                // }
            } else {
                enqueueSnackbar(response.message, { variant: 'error' });
            }
        })();
    }, [orderItems]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            sx={{ px: 2 }}
            width="100%"
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
            >
                <Typography variant="h2" component="span" color="primary">
                    Order Details
                </Typography>
                {filteredItems.map((item: TicketOrderItem) => (
                    <ItemRow key={item.id} item={item} />
                ))}
                {paymentDetails && (
                    <div>
                        {/* <DetailRow
                            itemName="Sub Total"
                            price={paymentDetails.subTotal}
                        /> */}
                        <DetailRow
                            itemName="Tax & Fees"
                            price={
                                paymentDetails.tax + paymentDetails.totalFees
                            }
                        />
                        <DetailRow
                            itemName="Total"
                            price={paymentDetails.total}
                        />
                    </div>
                )}
            </Box>
        </Box>
    );
};

export default OrderDetails;
