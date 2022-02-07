import { ApiRoutes } from 'src/constants';
import { BaseResponse } from 'src/types';
import { Api } from 'src/utils';

interface FansService {
    resendConfirmationEmail: (validationId: string) => Promise<BaseResponse>;
}

const fansService: FansService = {
    resendConfirmationEmail: async (validationId: string) => {
        const url = `${ApiRoutes.Fans.ResendVerificationEmail(validationId)}`;
        const response: BaseResponse = await Api.post(url, {});
        return response;
    },
};

export default fansService;
