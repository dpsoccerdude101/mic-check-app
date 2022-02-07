/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ChangeEvent, useEffect, useState, useReducer, useRef } from 'react';
import {
    Button,
    Typography,
    TextField,
    IconButton,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
} from '@material-ui/core';
import clsx from 'clsx';
import UploadFileIcon from '@material-ui/icons/Upload';
import YouTubeIcon from '@material-ui/icons/YouTube';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { YouTubeURLRegex } from 'src/constants/expressions';
import ytReducer from './ytReducer';
import ReactPlayer from 'react-player/youtube';
import BandYTVideo from 'src/types/band/bandYTVideo';
import AllowedSeconds from 'src/types/band/allowedSeconds';
import handleYTChange from './handleYTChange';
import BandYTVideoFactory from './BandYTVideoFactory';
import classes from './YTStyles';
import { YouTubeUtilities } from 'src/utils';
import { YOUTUBE_URL } from 'src/constants/appConstants';
import CustomSlider from './customSlider';
import { useBand } from 'src/hooks';
import CustomYTPlayer from 'src/components/custom/customYTPlayer';

const CustomYTLinkUpload = ({
    label,
    maxSeconds,
    mediaId = '0',
    addVideo,
}: {
    label: string;
    maxSeconds: AllowedSeconds;
    mediaId: string;
    addVideo: (newYTVideo: BandYTVideo) => void;
}) => {
    const { band } = useBand();
    const [youtubeURL, setYouTubeURL] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [doneTrimming, setDoneTrimming] = useState<boolean>(false);
    const [displayYoutubeQuery, setDisplayYoutubeQuery] =
        useState<boolean>(false);
    const [youTubeVideoDuration, setYouTubeVideoDuration] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState(false);
    const halfMaxSeconds = maxSeconds / 2;
    const { enqueueSnackbar } = useSnackbar();

    const {
        setYouTubeVideoID,
        setYouTubeVideoBandId,
        setYouTubeVideoStartTime,
        bandYTVideo,
    } = handleYTChange(band.id, maxSeconds);

    /*     //Scrubber!
    useEffect(() => {
        //Scrub to Selected Starting Place 
        if (youTubePlayer) {
            switch (youTubePlayer.PlayerState) {
                case '2':
            }
            const startTime = bandYTVideo.range[0];
            youTubePlayer.seekTo(startTime);

            setYouTubeVideoLoopID(
                window.setInterval(() => {
                    youTubePlayer.seekTo(startTime);
                }, maxSeconds * 1000)
            );

            console.dir('loop set: ' + bandYTVideo.loopID);
            return () => {
                clearInterval(bandYTVideo.loopID);
            };
        } else return;
    }, [bandYTVideo.range[0], youTubePlayer]); */

    /* const getYouTubeVideoDuration = async ({ id }: YouTubeVideo) => {
    const url = new URL('https://www.googleapis.com/youtube/v3/videos');
    url.search = new URLSearchParams({
        key: settings?.youtube?.apiKey,
        part: 'contentDetails',
        id: id,
    }).toString();

    return fetch(url)
        .then(async (response) => {
            const data = await response.json();
            const videos = data?.items || [];
            return videos.map((video) => {
                return {
                    id: video?.id,
                    duration: getDuration(video?.contentDetails?.duration),
                };
            });
        })
        .catch((error) => {
            console.warn(error);
        });
};
 */

    //
    const handleYTLinkConfirmation = () => {
        const youTubeId = youtubeURL
            ? YouTubeUtilities.getYouTubeId(youtubeURL)
            : '';
        youTubeId
            ? (() => {
                  setLoading(true);
                  setYouTubeVideoID(youTubeId);
                  setOpenDialog(true);
                  //after tests are passed then run this
                  setDisplayYoutubeQuery(false);
              })()
            : (() => {
                  //set to '' just in case
                  setYouTubeVideoID('');
                  enqueueSnackbar('The provided YouTube link is not valid.', {
                      variant: 'error',
                  });
              })();
    };

    const YouTubeVideo = () => {
        const onDuration = (newDuration: number) => {
            setYouTubeVideoDuration(newDuration);
            const halfOfMaxSeconds = maxSeconds / 2;
            //let startTime;
            //let endTime;

            /**
             * Set to midpoint!
             *
             * If the duration of the video minus half of the duration of the video
             * is less than maxSeconds (15 or 30) divided by 2 then set the end to be the duration of the video.
             * Else set it o
             */

            /*             if (newDuration - halfMaxSeconds < maxSeconds) {
                startTime = newDuration - maxSeconds;
                endTime = newDuration;
            } else {
                //set startTime to (duration / 2) - (maxSeconds / 2)
                startTime = newDuration / 2 - halfOfMaxSeconds;
                endTime = startTime + maxSeconds;
            } */

            const startTime =
                newDuration - halfMaxSeconds < maxSeconds
                    ? newDuration - maxSeconds
                    : newDuration / 2 - halfOfMaxSeconds;
            setYouTubeVideoStartTime(Math.floor(startTime));
        };

        const onReady = () => setLoading(false);

        /*         const onPlayerStateChange = (e) => {
            let done = false;
            const stopVideo = (e) => {
                e.target.stopVideo();
            };
            console.dir(e.target);
        }; */

        return (
            <>
                <Dialog
                    onClose={() => {}}
                    open={openDialog}
                    fullWidth={true}
                    maxWidth={'md'}
                >
                    <DialogTitle>Trim Selected YouTube Video</DialogTitle>
                    <Box sx={{ borderRadius: '5px', ...classes.videoRoot }}>
                        <ReactPlayer
                            url={`${YOUTUBE_URL}/${bandYTVideo.ytId}`}
                            width='100%'
                            height={`${23 * 2}vh`}
                            onDuration={onDuration}
                            onReady={onReady}
                            config={{
                                playerVars: {
                                    autoplay: 0,
                                    controls: 1,
                                    start: bandYTVideo.startTime,
                                },
                            }}
                            //onStateChange={onPlayerStateChange}
                        />
                    </Box>
                    {loading && <CircularProgress />}
                    {!loading && !doneTrimming && (
                        <>
                            <CustomSlider
                                bandYTVideo={bandYTVideo}
                                setYouTubeVideoStartTime={
                                    setYouTubeVideoStartTime
                                }
                                duration={youTubeVideoDuration}
                                maxSeconds={maxSeconds}
                                setDoneTrimming={setDoneTrimming}
                            />
                            <Button
                                variant='outlined'
                                size='medium'
                                sx={{ margin: '0 auto' }}
                                onClick={() => {
                                    addVideo(bandYTVideo);
                                    setDoneTrimming(true);
                                    setOpenDialog(false);
                                }}
                            >
                                Select Clip
                            </Button>
                        </>
                    )}
                </Dialog>
            </>
        );
    };

    const showYouTubeVideoOrInput = () => {
        if (bandYTVideo.ytId) return YouTubeVideo();

        return (
            <>
                {!displayYoutubeQuery && (
                    <>
                        <Typography
                            variant='body1'
                            color='primary'
                            sx={{ ...classes.p }}
                        >
                            Link {label}
                        </Typography>
                        <Button
                            component='label'
                            startIcon={<YouTubeIcon style={{ fontSize: 15 }} />}
                            sx={{ ...classes.button }}
                            size='small'
                            variant='contained'
                            onClick={() => setDisplayYoutubeQuery(true)}
                        >
                            Choose YouTube
                        </Button>
                    </>
                )}

                {displayYoutubeQuery && (
                    <Box sx={{ display: 'flex', p: 1, m: 1 }}>
                        <TextField
                            label='YouTube Video Link'
                            variant='outlined'
                            type='url'
                            size='small'
                            autoComplete='url'
                            name='youtubeURL'
                            value={youtubeURL}
                            onChange={({ target: { value } }) =>
                                setYouTubeURL(value)
                            }
                        />
                        <IconButton
                            color='inherit'
                            name='Confirm'
                            aria-label='Confirm YouTube Link Input'
                            onClick={handleYTLinkConfirmation}
                        >
                            <CheckIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                            color='inherit'
                            name='cancel'
                            aria-label='Cancel YouTube Link Input'
                            onClick={() => {
                                setDisplayYoutubeQuery(false);
                                setYouTubeVideoID('');
                            }}
                        >
                            <CancelIcon fontSize='small' />
                        </IconButton>
                    </Box>
                )}
            </>
        );
    };

    const renderBody = () => {
        /* if (base64Data && !fileData) {
            return <CustomLoader />;
        } */

        return (
            <Box
                sx={{
                    ...classes.root,
                    ...(!(bandYTVideo.ytId && doneTrimming) && {
                        ...classes.dashedBorder,
                        ...classes.grayBg,
                    }),
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    {showYouTubeVideoOrInput()}
                </Box>
            </Box>
        );
    };

    return renderBody();
};

CustomYTLinkUpload.propTypes = {
    label: PropTypes.string.isRequired,
    maxSeconds: PropTypes.number.isRequired,
    mediaId: PropTypes.string,
};

export default CustomYTLinkUpload;
