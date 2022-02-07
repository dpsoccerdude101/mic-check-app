import BandYTVideo from 'src/types/band/bandYTVideo';
import AllowedSeconds from 'src/types/band/allowedSeconds';

type Action =
    | { type: 'SETYOUTUBEID'; payload: string }
    | { type: 'SETBANDID'; payload: string }
    | { type: 'SETOTALSECONDS'; payload: AllowedSeconds }
    | { type: 'SETSTARTTIME'; payload: number };

const ytReducer = (state: BandYTVideo, { type, payload }: Action) => {
    switch (type) {
        case 'SETYOUTUBEID': {
            return { ...state, ytId: payload as string };
        }
        case 'SETBANDID': {
            return { ...state, bandId: payload as string };
        }
        case 'SETOTALSECONDS': {
            return { ...state, totalSeconds: payload as AllowedSeconds };
        }
        case 'SETSTARTTIME': {
            return { ...state, startTime: payload as number };
        }
        default: {
            throw new Error(`Unhandled type: ${type}`);
        }
    }
};

export default ytReducer;
