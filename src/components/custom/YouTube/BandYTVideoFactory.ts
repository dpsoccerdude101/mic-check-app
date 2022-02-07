import BandYTVideo from 'src/types/band/bandYTVideo';
import AllowedSeconds from 'src/types/band/allowedSeconds';
import { Band } from 'src/types';

const BandYTVideoFactory = (
    bandId: string,
    totalSeconds: AllowedSeconds
): BandYTVideo => {
    return {
        bandId: bandId ?? '',
        totalSeconds: totalSeconds,
        ytId: '',
        startTime: 0,
    };
};
export default BandYTVideoFactory;
