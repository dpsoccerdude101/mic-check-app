import { ApiRoutes } from 'src/constants';
import { BaseResponse, TicketOrderItem } from 'src/types';
import Cart from 'src/types/order/cart/cart';
import { Api } from 'src/utils';

interface CartService {
    getCart: (items: TicketOrderItem[], SquarePayment: boolean) => Promise<BaseResponse<Cart>>;
    calculatePayment: (cart: Cart) => Promise<BaseResponse<Cart>>;
}

const cartService: CartService = {
    getCart: async (items: TicketOrderItem[], SquarePayment) => {

        const url = (SquarePayment ? ApiRoutes.Cart.CreateSquareCart : ApiRoutes.Cart.CreateCart);
        console.log('getCart url', url);

        const response: BaseResponse<Cart> = await Api.post(url, items);
        return response;
    },
    calculatePayment: async (cart: Cart) => {
        const url = ApiRoutes.Cart.CalculatePayment;
        const response: BaseResponse<Cart> = await Api.post(url, cart);
        return response;
    },
};

export default cartService;
