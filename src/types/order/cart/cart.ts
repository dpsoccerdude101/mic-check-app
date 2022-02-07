import { TicketOrderItem } from 'src/types';
import PaymentDetails from './paymentDetails';

type Cart = {
    items: TicketOrderItem[];
    paymentDetails: PaymentDetails;
};

export default Cart;
