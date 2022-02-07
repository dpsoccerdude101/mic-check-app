/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { Divider, Grid, Typography, makeStyles, Box } from '@material-ui/core';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import { useBandVideos, useBandYTVideos } from 'src/hooks/useBand';
import {
    CustomBox,
    CustomLoader,
    CustomVideoUpload,
    DeleteVideoIcon,
} from 'src/components';
import { useBand } from 'src/hooks';
import { BandMedia, FileModel } from 'src/types';
import CustomYTVideoLinkUpload from 'src/components/custom/YouTube/customYTVideoLinkUpload';
import BandYTVideo from 'src/types/band/bandYTVideo';
import CustomYTPlayer from 'src/components/custom/customYTPlayer';
import { BaseResponse } from 'src/types';

const VideosTab = () => {
    const { band } = useBand();
    const [isLoading, setLoading] = useState(false);
    const { addVideo, videos } = useBandVideos();
    const { addYTVideo, ytVideos, setYTVideos } = useBandYTVideos();
    const [smallVideos, setSmallVideos] = useState<BandMedia[]>([]);
    const [longVideos, setLongVideos] = useState<BandMedia[]>([]);
    const [shortYTVideos, setShortYTVideos] = useState<BandYTVideo[]>([]);
    const [longYTVideos, setLongYTVideos] = useState<BandYTVideo[]>([]);
    const { id } = band;

/*     useEffect(() => {
        const loadYTVideosFromDB = async () => {
            const ytResponse: BaseResponse<BandYTVideo[]> = await Api.get(
                ApiRoutes.YouTubeVideos.GetAllBandVideos(band.id)
            );
            const { data, success } = ytResponse;

            if (success) setYTVideos(data);
        };
        loadYTVideosFromDB();
    }, []); */

    useEffect(() => {
        const loadPublicFilePath = async (
            loadedMedias: BandMedia[]
        ): Promise<BandMedia[]> => {
            // eslint-disable-next-line no-restricted-syntax
            for (const el of loadedMedias) {
                // eslint-disable-next-line no-await-in-loop
                const result = await Api.get(
                    ApiRoutes.Files.GetFilePath(el.fileId)
                );
                el.publicFilePath = result.data;
            }
            return loadedMedias;
        };

        const getSmallVideosLoaded = async (
            loadedMedias: BandMedia[]
        ): Promise<BandMedia[]> => {
            let smallLoaded: BandMedia[] = [];
            if (loadedMedias.length > 0) {
                smallLoaded = loadedMedias.filter(
                    (el) => el.totalSeconds === 15
                );
                smallLoaded = await loadPublicFilePath(smallLoaded);
            }
            return smallLoaded;
        };

        const getLongVideosLoaded = async (
            loadedMedias: BandMedia[]
        ): Promise<BandMedia[]> => {
            let longLoaded: BandMedia[] = [];
            if (loadedMedias.length > 0) {
                longLoaded = loadedMedias.filter(
                    (el) => el.totalSeconds === 30
                );
                longLoaded = await loadPublicFilePath(longLoaded);
            }
            return longLoaded;
        };

        const fillVideoSpaces = async (
            loadedMedias: BandMedia[],
            ytVideos: BandYTVideo[]
        ) => {
            const tempSmallMedias = await getSmallVideosLoaded(loadedMedias);
            while (tempSmallMedias.length < 1) {
                tempSmallMedias.push({
                    bandId: id,
                    mediaFile: null,
                    totalSeconds: 15,
                    fileId: null,
                });
            }
            setSmallVideos(tempSmallMedias);

            const tempLongVideos = await getLongVideosLoaded(loadedMedias);
            while (tempLongVideos.length < 2) {
                tempLongVideos.push({
                    bandId: id,
                    mediaFile: null,
                    totalSeconds: 30,
                    fileId: null,
                });
            }
            setLongVideos(tempLongVideos);

            const tempShortYTVideos = [
                ...ytVideos.filter((elem) => elem.totalSeconds === 15),
            ];
            while (tempShortYTVideos.length < 1) {
                tempShortYTVideos.push({
                    bandId: id,
                    ytId: '',
                    totalSeconds: 15,
                    startTime: 0,
                });
            }
            setShortYTVideos(tempShortYTVideos);

            const tempLongYTVideos = [
                ...ytVideos.filter((elem) => elem.totalSeconds === 30),
            ];
            while (tempLongYTVideos.length < 2) {
                tempLongYTVideos.push({
                    bandId: id,
                    ytId: '',
                    totalSeconds: 30,
                    startTime: 0,
                });
            }
            setLongYTVideos(tempLongYTVideos);
        };

        const main = async () => {
            setLoading(true);
            await fillVideoSpaces(videos, ytVideos);
            setLoading(false);
        };
        main();
    }, [videos, ytVideos]);

    const mountVideos = (media: BandMedia, i: number, small: boolean) => {
        const label = small ? 'small' : 'long';

        let videoData = null;

        // If has on database, load from api
        if (media.id && media.id > 0) {
            videoData = media.publicFilePath;
        }

        // Load from memory
        /**
         * This feature is disabled until Vimeo Integration Solution is implemented.
         */
        if (media.mediaFile && media.mediaFile.srcString) {
            videoData = media.mediaFile.srcString;
        }
        return (
            <Grid
                key={`${label}_${i}`}
                item
                xs={12}
                md={4}
                sx={{
                    height: '25vh',
                    display: 'block',
                    position: 'relative',
                }}
            >
                <CustomVideoUpload
                    label="Video"
                    base64Data={videoData}
                    mediaId={media.id}
                    maxSeconds={media.totalSeconds}
                    setFileModel={(fileModel: FileModel) => {
                        const currMedias = small ? smallVideos : longVideos;
                        const currEl = currMedias.find((x) => x === media);
                        currEl.mediaFile = fileModel;
                        if (small) setSmallVideos(currMedias);
                        else setLongVideos(currMedias);
                        addVideo(currEl);
                    }}
                />
            </Grid>
        );
    };

    const mountYTVideos = (ytVideo: BandYTVideo, i: number, short: boolean) => {
        const label = short ? 'short' : 'long';
        return (
            <Grid
                key={`${label}_${i}`}
                item
                xs={12}
                md={4}
                sx={{
                    ...(!ytVideo.ytId && { height: '25vh' }),
                    display: 'block',
                    position: 'relative',
                }}
            >
                {ytVideo.ytId ? (
                    <>
                        <CustomYTPlayer bandYTVideo={ytVideo} />
                        {/* Removes dashes to allow for ID to be parsed */}
                        {ytVideo.id && (
                            <DeleteVideoIcon
                                mediaId={ytVideo.id}
                                isYTVideo={true}
                            />
                        )}
                    </>
                ) : (
                    <CustomYTVideoLinkUpload
                        label="Video"
                        mediaId={ytVideo.id}
                        maxSeconds={ytVideo.totalSeconds}
                        addVideo={(newYTVideo: BandYTVideo) => {
                            //returns a copy using spread
                            const currYTVideos = short
                                ? [...shortYTVideos]
                                : [...longYTVideos];

                            currYTVideos[
                                currYTVideos.findIndex(
                                    (elem) => elem === ytVideo
                                )
                            ] = {
                                ...newYTVideo,
                            };
                            short
                                ? setShortYTVideos(currYTVideos)
                                : setLongYTVideos(currYTVideos);
                            console.dir(newYTVideo);
                            addYTVideo(newYTVideo);
                        }}
                    />
                )}
            </Grid>
        );
    };

    /**
     *
     * If there is 1 15-second YTVideo loaded from the DB
     * then 0 non-YT 15-second videos are shown,
     * else render 1 15-second video to allow for deletion.
     */
    const render15sVideos = () => {
        const smallVideosFromDB = smallVideos.filter((elem) => elem.id);
        return smallVideosFromDB.length > 0
            ? smallVideosFromDB
                  .slice(0, 1)
                  .map((el, i) => mountVideos(el, i, true))
            : shortYTVideos
                  .slice(0, 1)
                  .map((el, i) => mountYTVideos(el, i, true));
    };

    const render30sVideos = () =>
        longYTVideos.slice(0, 2).map((el, i) => mountYTVideos(el, i, false));

    const render30sLegacyVideos = () =>
        longVideos
            .filter((elem) => elem.id)
            .map((el, i) => mountVideos(el, i, false));

    const renderBody = () => {
        if (isLoading) {
            return <CustomLoader />;
        }

        return (
            <CustomBox>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h2">
                            15 Seconds Teaser Videos
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    {render15sVideos()}
                    <Grid item xs={12}>
                        <Typography variant="h2">
                            30 Seconds Recap Videos
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    {render30sLegacyVideos()}
                    {render30sVideos()}
                </Grid>
            </CustomBox>
        );
    };

    return renderBody();
};

export default VideosTab;
