import { BaseResponse } from 'src/types';
import { ApiRoutes } from 'src/constants';
import { Api } from 'src/utils';

interface PaymentService {
    getPayPalClientId: () => Promise<BaseResponse>;
}

const paymentService: PaymentService = {
    getPayPalClientId: async () => {
        const url = ApiRoutes.Payments.GetPayPalClientId;
        console.log('paymentService.getPayPalClientId() url', url);
        const response: BaseResponse = await Api.get(url);
        return response;
    },
};

export default paymentService;
