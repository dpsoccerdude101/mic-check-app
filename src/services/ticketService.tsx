import { BaseResponse, PatronListRequest, TicketInfo } from 'src/types';
import { ApiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import TicketInstance from 'src/types/tickets/ticketInstance';
import GetUserTicketsRequest from 'src/types/tickets/getUserTicketsRequest';
import TicketScanRequest from 'src/types/tickets/ticketScanRequest';
import TicketAdmitRequest from 'src/types/tickets/ticketAdmitRequest';
import queryString from 'query-string';
import TicketInstanceDetailsForScan from 'src/types/tickets/ticketInstanceDetailsForScan';
import { number } from 'prop-types';

interface TicketService {
    addTicketInfo: (request: TicketInfo) => Promise<BaseResponse<TicketInfo>>;
    updateTicketInfo: (
        request: TicketInfo
    ) => Promise<BaseResponse<TicketInfo>>;
    getUserTickets: (
        request: GetUserTicketsRequest
    ) => Promise<BaseResponse<TicketInstance[]>>;
    admitTicket: (
        request: TicketAdmitRequest
    ) => Promise<BaseResponse<TicketInstanceDetailsForScan>>;
    scanTicket: (
        request: TicketScanRequest
    ) => Promise<BaseResponse<TicketInstanceDetailsForScan>>;
    getById: (id: string) => Promise<BaseResponse<TicketInstance>>;
    getDetailsForScanById: (
        id: string
    ) => Promise<BaseResponse<TicketInstanceDetailsForScan>>;
    getDetailsForScanByShowId: (
        showId: string,
        name?: string
    ) => Promise<BaseResponse<TicketInstanceDetailsForScan[]>>;
    getRemainingTickets: (
        ticketInfoId: string,
        maxCapacity: number
    ) => Promise<BaseResponse<{ remaining: number }>>;
}

const ticketService: TicketService = {
    addTicketInfo: async (request: TicketInfo) => {
        const url = ApiRoutes.TicketInfos.Create;
        const response: BaseResponse<TicketInfo> = await Api.post(url, request);
        return response;
    },

    updateTicketInfo: async (request: TicketInfo) => {
        const { id } = request;
        const url = ApiRoutes.TicketInfos.Update(id);
        const response: BaseResponse<TicketInfo> = await Api.put(url, request);
        return response;
    },

    getUserTickets: async ({ showId }: GetUserTicketsRequest) => {
        const url = ApiRoutes.TicketInstances.GetUserTickets(showId);
        const response: BaseResponse<TicketInstance[]> = await Api.get(url);
        return response;
    },

    admitTicket: async (request: TicketAdmitRequest) => {
        const url = ApiRoutes.TicketInstances.AdmitTicket;
        const response: BaseResponse<TicketInstanceDetailsForScan> =
            await Api.post(url, request);
        return response;
    },

    scanTicket: async (request: TicketScanRequest) => {
        const url = ApiRoutes.TicketInstances.ScanTicket;
        const response: BaseResponse<TicketInstanceDetailsForScan> =
            await Api.post(url, request);
        return response;
    },

    getById: async (id: string) => {
        const url = `${
            ApiRoutes.TicketInstances.GetById
        }?${queryString.stringify({ id })}`;
        const response: BaseResponse<TicketInstance> = await Api.get(url);
        return response;
    },

    getDetailsForScanById: async (id: string) => {
        const url = `${
            ApiRoutes.TicketInstances.GetDetailsForScanById
        }?${queryString.stringify({ id })}`;
        const response: BaseResponse<TicketInstanceDetailsForScan> =
            await Api.get(url);
        return response;
    },

    getDetailsForScanByShowId: async (showId: string, name?: string) => {
        const request: PatronListRequest = {
            showId,
            name,
        };
        const url =
            ApiRoutes.TicketInstances.GetDetailsForScanByShowId(request);
        const response: BaseResponse<TicketInstanceDetailsForScan[]> =
            await Api.get(url);
        return response;
    },

    getRemainingTickets: async (ticketInfoId: string, maxCapacity: number) => {
        const url = ApiRoutes.TicketInstances.GetRemainingTickets(
            ticketInfoId,
            maxCapacity
        );
        const response: BaseResponse<{ remaining: number }> = await Api.get(
            url
        );
        return response;
    },
};

export default ticketService;
