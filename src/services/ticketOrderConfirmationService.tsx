import { BaseResponse, TicketInfo, TicketOrderItem } from 'src/types';
import { ApiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import TicketOrderConfirmation from 'src/types/tickets/ticketOrderConfirmationInfo';

interface TicketOrderConfirmationService {
    get: (ticketId: string) => Promise<BaseResponse<TicketOrderConfirmation>>;
    getByOrderId: (orderId: string) => Promise<BaseResponse<TicketOrderConfirmation>>;
}

const ticketOrderConfirmationService: TicketOrderConfirmationService = {
    get: async (ticketId: string) => {
        const url = `${ApiRoutes.TicketOrderConfirmation.Get}?id=${ticketId}`;
        console.log('ticketOrderConfirmationService.get(): url', url);
        const response: BaseResponse<TicketOrderConfirmation> = await Api.get(
            url
        );
        return response;
    },
    getByOrderId: async (orderId: string) => {
        const url = ApiRoutes.TicketOrderConfirmation.GetByOrderId(orderId);
        const response: BaseResponse<TicketOrderConfirmation> = await Api.get(
            url
        );
        return response;
    }
};

export default ticketOrderConfirmationService;
