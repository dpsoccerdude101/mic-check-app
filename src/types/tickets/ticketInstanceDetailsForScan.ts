import User from '../users/user';
import TicketInstance from './ticketInstance';

type TicketInstanceDetailsForScan = TicketInstance & {
  user: User; // TODO: should this be a different/better type?
};

export default TicketInstanceDetailsForScan;
