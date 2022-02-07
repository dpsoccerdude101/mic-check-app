import { useEffect } from 'react';
import { ValidateCodeForm } from 'src/components';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import {
  BaseResponse, PendingFan, ValidateCodeRequest
} from 'src/types';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { Api } from 'src/utils';

type ValidateFanCodeProps = {
  model: BaseResponse<PendingFan>
};

const ValidateFanCode = ({ model }: ValidateFanCodeProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    const { success, message } = model;
    if (!success) {
      enqueueSnackbar(message, { variant: 'error' });
      router.push(UiRoutes.Auth.Register);
    }
  }, []);

  const validateFanCode = async (code: string) => {
    const request: ValidateCodeRequest = {
      pendingId: model.data.id,
      validationCode: code
    };

    const response: BaseResponse = await Api.post(ApiRoutes.Fans.ValidateCode, request);
    const { message, success } = response;
    if (success) {
      router.push(UiRoutes.Fans.Validate(model.data.id));
    } else {
      enqueueSnackbar(message, { variant: 'error' });
      if (message.includes('Exceeded validation tries')) { router.push(UiRoutes.Auth.Register); }
    }
  };

  return (
    <ValidateCodeForm submitAction={validateFanCode} />
  );
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const response: BaseResponse<PendingFan> = await Api.get(ApiRoutes.Fans.GetPending(id), context);
  return { props: { model: response } };
}

export default ValidateFanCode;
