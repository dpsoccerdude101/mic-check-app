import { CheckoutRequest } from 'src/types';

type SquareCheckoutRequest = CheckoutRequest & {
    amount: number;
    showId: string;
    email: string;
    phoneNumber: string;
};

export default SquareCheckoutRequest;
