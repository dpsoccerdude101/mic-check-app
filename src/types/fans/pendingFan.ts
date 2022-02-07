import FinishRegisterModel from '../auth/finishRegisterModel';

type BasePendingFan = {
  id: string;
  isMobile: boolean;
  phoneNumberValidationId: string;
};

type PendingFan = BasePendingFan & FinishRegisterModel;

export default PendingFan;
