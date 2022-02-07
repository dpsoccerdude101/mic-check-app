import AllowedSeconds from './allowedSeconds';

type BandYTVideo = {
    id?: string;
    bandId: string;
    totalSeconds: AllowedSeconds;
    ytId: string;
    /**startTime in seconds
    End time is calculated as startTime + totalSeconds
    */
    startTime: number;
};

export default BandYTVideo;
