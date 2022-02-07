import Address from '../address';

type FanShowPlanDto = {
  bandId: string;
  showId: string;
  bandName: string;
  showDate: Date;
  showVenueName: string;
  showAddress: Address
};

export default FanShowPlanDto;
