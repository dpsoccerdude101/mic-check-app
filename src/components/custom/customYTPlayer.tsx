import { Box } from '@material-ui/core';
import BandYTVideo from 'src/types/band/bandYTVideo';
import ReactPlayer from 'react-player/youtube';
import { YOUTUBE_URL } from 'src/constants/appConstants';

type Props = {
    bandYTVideo: BandYTVideo;
    onDuration?: (newDuration: number) => void;
    onReady?: () => void;
};

const CustomYTPlayer = ({
    bandYTVideo,
    onDuration = () => { },
    onReady = () => { },
}: Props) => (
    <Box
        sx={
            {
                /* maxWidth: '420px', margin: '0px auto' */
            }
        }
    >
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                //maxWidth: '420px',
            }}
        >
            <ReactPlayer
                url={`${YOUTUBE_URL}/${bandYTVideo.ytId}`}
                style={{
                    /*  width: '100%',
                    height: '23vh', */
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    border: '0',
                }}
                height="100%"
                width="100%"
                onDuration={onDuration}
                onReady={onReady}
                loop={true}
                light={bandYTVideo.ytId ? true : false}
                config={{
                    playerVars: {
                        controls: 1,
                        modestbranding: 1,
                        ...(bandYTVideo.ytId && bandYTVideo.startTime && {
                            start: bandYTVideo.startTime,
                            end:
                                bandYTVideo.startTime +
                                bandYTVideo.totalSeconds,
                        }),
                        ...(bandYTVideo.id && {
                            autoplay: 0,
                            controls: 0,
                        })
                    },
                }}
            />
        </Box>
    </Box>
);
export default CustomYTPlayer;
