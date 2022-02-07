import { ApiRoutes } from 'src/constants';
import { BaseResponse } from 'src/types';
import { Api } from 'src/utils';

interface BandMembersService {
    resendConfirmationEmail: (validationId: string) => Promise<BaseResponse>;
}

const bandMembersService: BandMembersService = {
    resendConfirmationEmail: async (validationId: string) => {
        const url = `${ApiRoutes.BandMembers.ResendVerificationEmail(
            validationId
        )}`;
        const response: BaseResponse = await Api.post(url, {});
        return response;
    },
};

export default bandMembersService;
