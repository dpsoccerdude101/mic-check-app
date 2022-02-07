import { useEffect } from 'react';
import { ValidateCodeForm } from 'src/components';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { BaseResponse, PendingMember, ValidateCodeRequest } from 'src/types';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { Api } from 'src/utils';

type ValidateBandMemberCodeProps = {
  model: BaseResponse<PendingMember>
};

const ValidateBandMemberCode = ({ model }: ValidateBandMemberCodeProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const { success, message } = model;
    if (!success) {
      enqueueSnackbar(message, { variant: 'error' });
      router.push(UiRoutes.Auth.Register);
    }
  }, []);

  const validateMemberCode = async (code: string) => {
    const request: ValidateCodeRequest = {
      pendingId: model.data.id,
      validationCode: code
    };

    const response: BaseResponse = await Api.post(ApiRoutes.Bands.ValidateCode, request);
    const { message, success } = response;
    if (success) {
      router.push(UiRoutes.Bands.ValidateMember(model.data.id));
    } else {
      enqueueSnackbar(message, { variant: 'error' });
      if (message.includes('Exceeded validation tries')) { router.push(UiRoutes.Auth.Register); }
    }
  };

  return (
    <ValidateCodeForm submitAction={validateMemberCode} />
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response: BaseResponse<PendingMember> = await Api.get(ApiRoutes.Bands.GetPendingMember(id));
  return { props: { model: response } };
}

export default ValidateBandMemberCode;
