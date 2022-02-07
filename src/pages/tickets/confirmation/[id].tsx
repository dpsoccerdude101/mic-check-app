import Dialog from 'src/components/ticket/order/dialog';
import {
  TicketOrderConfirmationHeader as Header,
} from 'src/components';
import Body from 'src/components/ticket/order/confirmation/body';

const Confirmation = () => <Dialog header={<Header />} body={<Body />} />;

export default Confirmation;
