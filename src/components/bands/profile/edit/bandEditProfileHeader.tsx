import { useState } from 'react';
import { useBand } from 'src/hooks';
import {
    useBandGeneral,
    useBandLinks,
    useBandVideos,
    useBandYTVideos,
} from 'src/hooks/useBand';
import { Button, Grid, Typography } from '@material-ui/core';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import { useSnackbar } from 'notistack';
import BandProfileLinks from 'src/types/band/bandProfileLinks';
import type { BandMedia, BandProfileGeneral, BaseResponse } from 'src/types';
import BandYTVideo from 'src/types/band/bandYTVideo';

const BandEditProfileHeader = () => {
    const { name, description, selectedGenreTags, hometown, profilePicture } =
        useBandGeneral();
    const [errorsCount, setErrorsCount] = useState(0);
    const { videos } = useBandVideos();
    const { ytVideos, setYTVideos } = useBandYTVideos();
    const { links } = useBandLinks();
    const { band, setLoading, setProfilePreview } = useBand();
    const { enqueueSnackbar } = useSnackbar();

    const notifyIfError = (response: BaseResponse) => {
        const { success, message } = response;
        if (!success) {
            setErrorsCount(errorsCount + 1);
            enqueueSnackbar(message, { variant: 'error' });
        }
    };

    const saveGeneral = async (): Promise<void> => {
        const obj: BandProfileGeneral = {
            id: band.id,
            name,
            description,
            hometown,
            profilePicture,
            selectedGenreTags,
        };
        const response: BaseResponse = await Api.put(
            ApiRoutes.Bands.SaveGeneral,
            obj
        );
        notifyIfError(response);
    };

    const saveLinks = async (): Promise<void> => {
        const filledLinks = links.filter((el) => el.url && el.url !== '');
        const requestObj: BandProfileLinks = {
            bandId: band.id,
            socialMedias: filledLinks,
        };
        const response = await Api.put(
            ApiRoutes.Bands.SaveSocialMedias,
            requestObj
        );
        notifyIfError(response);
    };

    const saveVideo = async (video: BandMedia): Promise<void> => {
        // Shrinking the request size \/
        const requestObj: BandMedia = {
            id: video.id,
            bandId: video.bandId,
            totalSeconds: video.totalSeconds,
            fileId: video.fileId,
            mediaFile: {
                content: video.mediaFile.content,
                contentType: video.mediaFile.contentType,
                name: video.mediaFile.name,
                size: video.mediaFile.size,
                srcString: null,
            },
        };

        const response: BaseResponse = await Api.put(
            ApiRoutes.Bands.SaveMedia,
            requestObj
        );
        notifyIfError(response);
    };

    const saveYTVideo = async (YTVideo: BandYTVideo): Promise<void> => {
        const requestObj: BandYTVideo = {
            id: YTVideo.id,
            bandId: YTVideo.bandId,
            totalSeconds: YTVideo.totalSeconds,
            ytId: YTVideo.ytId,
            startTime: YTVideo.startTime,
        };
        if (!requestObj.id) {
            // if id exists then that means that the video is already on the DB
            const response: BaseResponse = await Api.post(
                ApiRoutes.YouTubeVideos.SaveYTVideo,
                requestObj
            );
            //Allow the Video to be deleted
            if (response.success) {
                const currYTVideos = [...ytVideos];

                currYTVideos[
                    currYTVideos.findIndex((elem) => elem === YTVideo)
                ] = {
                    ...response.data,
                };

                setYTVideos(currYTVideos);
            } else notifyIfError(response);
        }
    };

    const saveChanges = async () => {
        setLoading(true);
        const promises: Promise<void>[] = [];
        promises.push(saveGeneral());
        promises.push(saveLinks());
        ytVideos.forEach(async (ytVideo: BandYTVideo) => {
            if (ytVideo.ytId && ytVideo.startTime) {
                promises.push(saveYTVideo(ytVideo));
            }
        });
        videos.forEach(async (video: BandMedia) => {
            if (video.mediaFile && video.mediaFile.content) {
                promises.push(saveVideo(video));
            }
        });
        await Promise.all(promises);
        setLoading(false);
    };

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
                <Typography variant="h1">Band Profile</Typography>
            </Grid>
            <Grid
                sx={{ display: { xs: 'none', md: 'block' } }}
                item
                xs={4}
                md={2}
            />
            <Grid item xs={4} md={3}>
                <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    onClick={() => setProfilePreview(true)}
                >
                    Preview
                </Button>
            </Grid>
            <Grid item xs={8} sm={4} md={3}>
                <Button
                    fullWidth
                    variant="contained"
                    type="button"
                    onClick={async () => saveChanges()}
                >
                    Save Changes
                </Button>
            </Grid>
        </Grid>
    );
};

export default BandEditProfileHeader;
