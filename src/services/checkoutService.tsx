import { ApiRoutes } from 'src/constants';
import {
    BaseResponse,
    CheckoutRequest,
    GuestCheckoutRequest,
    GuestCheckoutResponse,
    SquareCheckoutRequest
} from 'src/types';
import { Api } from 'src/utils';

interface CheckoutService {
    checkout: (request: CheckoutRequest) => Promise<BaseResponse>;
    guestCheckout: (
        request: GuestCheckoutRequest
    ) => Promise<BaseResponse<GuestCheckoutResponse>>;
    checkout2: (request: CheckoutRequest) => Promise<BaseResponse>;
    guestCheckout2: (
        request: GuestCheckoutRequest
    ) => Promise<BaseResponse<GuestCheckoutResponse>>;
    confirm: (paypalOrderId: string) => Promise<BaseResponse>;
    cancel: (paypalOrderId: string) => Promise<void>;
    squareCheckout: (request: SquareCheckoutRequest) => Promise<BaseResponse>;
    free: (request: CheckoutRequest) => Promise<BaseResponse>;
    guestFree: (request: GuestCheckoutRequest) => Promise<BaseResponse>;
}

const checkoutService: CheckoutService = {
    checkout2: async (request: CheckoutRequest) => {
        const url = ApiRoutes.Orders.Checkout2;
        const response: BaseResponse = await Api.post(url, request);
        return response;
    },
    guestCheckout2: async (request: GuestCheckoutRequest) => {
        const url = ApiRoutes.Orders.GuestCheckout2;
        const response: BaseResponse<GuestCheckoutResponse> = await Api.post(
            url,
            request
        );
        return response;
    },
    confirm: async (paypalOrderId: string) => {
        const url = ApiRoutes.Orders.Confirm;
        const response: BaseResponse = await Api.post(url, {
            payPalOrderId: paypalOrderId,
        });
        return response;
    },
    cancel: async (paypalOrderId: string) => {
        const url = ApiRoutes.Orders.Cancel(paypalOrderId);
        await Api.post(url, {});
    },

    checkout: async (request: CheckoutRequest) => {
        const url = ApiRoutes.Orders.Checkout;
        const response: BaseResponse = await Api.post(url, request);
        return response;
    },
    guestCheckout: async (request: GuestCheckoutRequest) => {
        const url = ApiRoutes.Orders.GuestCheckout;
        const response: BaseResponse<GuestCheckoutResponse> = await Api.post(
            url,
            request
        );
        return response;
    },
    squareCheckout: async (request: SquareCheckoutRequest) => {
        const url = ApiRoutes.TerminalCheckout.Checkout;
        const response: BaseResponse = await Api.post(url, request);
        return response;
    },

    free: async (request: CheckoutRequest) => {
        const url = ApiRoutes.Orders.Free;
        const response: BaseResponse = await Api.post(url, request);
        return response;
    },
    guestFree: async (request: GuestCheckoutRequest) => {
        const url = ApiRoutes.Orders.GuestFree;
        const response: BaseResponse = await Api.post(url, request);
        return response;
    },
};

export default checkoutService;
