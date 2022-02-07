import FinishRegisterModel from '../auth/finishRegisterModel';

type BandPendingMember = {
  id: string;
  bandId: string;
  userAlreadyExists: boolean;
};

type PendingMember = BandPendingMember & FinishRegisterModel;

export default PendingMember;
