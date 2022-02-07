import { YouTubeURLRegex } from 'src/constants/expressions';

const getYouTubeId: (youtubeURL: string) => string = (youtubeURL: string) => {
    const youTubeVideoUrlArr = youtubeURL.match(YouTubeURLRegex);
    //Position 5 in the array holds the youtubeID and position 6 holds all arguments
    //given after the ID such as start & end times
    //All YouTube ID's are of length 11
    return youTubeVideoUrlArr &&
        youTubeVideoUrlArr.length > 5 &&
        youTubeVideoUrlArr[5].length === 11
        ? youTubeVideoUrlArr[5]
        : '';
};

const YouTubeUtilities = { getYouTubeId };
export default YouTubeUtilities;
