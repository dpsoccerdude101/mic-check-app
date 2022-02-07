import TicketInfo from './ticketInfo';
import TicketInstance from './ticketInstance';

type TicketOrderConfirmation = {
    showName: string;
    showDate: Date;
    notifcationSentTo: string;
    needsValidation: boolean;
    validationId: string;
    venueName: string;
    ticketInstances: TicketInstance[];
};

export default TicketOrderConfirmation;
