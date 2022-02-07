import TicketOrderItem from '../../tickets/ticketOrderItem';
import BillingInfo from './billingInfo';

type CheckoutRequest = {
    sourceBandId: string;
    items: TicketOrderItem[];
    supportedShowBandIds: number[];
    billingInfo?: BillingInfo;
};

export default CheckoutRequest;
