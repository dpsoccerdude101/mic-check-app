import BandComboObj from '../band/bandComboObj';

type ShowBandDto = {
    id?: number;
    band?: BandComboObj;
    bandId: string;
    startTime: Date;
    endTime: Date;
};

export default ShowBandDto;
