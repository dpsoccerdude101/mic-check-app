import { useReducer } from 'react';
import ytReducer from './ytReducer';
import BandYTVideoFactory from './BandYTVideoFactory';
import BandYTVideo from 'src/types/band/bandYTVideo';
import AllowedSeconds from 'src/types/band/allowedSeconds';
import { Band } from 'src/types';

const handleYTChange = (
    bandId: string, maxSeconds: AllowedSeconds
): {
    setYouTubeVideoID: (val: string) => void;
    setYouTubeVideoBandId: (val: string) => void;
    setYouTubeVideoStartTime: (val: number) => void;
    bandYTVideo: typeof bandYTVideo;
} => {
    const [bandYTVideo, dispatch] = useReducer(
        ytReducer,
        BandYTVideoFactory(bandId, maxSeconds)
    );
    const setYouTubeVideoID = (val: string) =>
        dispatch({
            type: 'SETYOUTUBEID',
            payload: val,
        });
    const setYouTubeVideoBandId = (val: string) =>
        dispatch({
            type: 'SETBANDID',
            payload: val,
        });
    const setYouTubeVideoStartTime = (val: number) =>
        dispatch({
            type: 'SETSTARTTIME',
            payload: val,
        });
    return {
        setYouTubeVideoID,
        setYouTubeVideoBandId,
        setYouTubeVideoStartTime,
        bandYTVideo,
    };
};

export default handleYTChange;
