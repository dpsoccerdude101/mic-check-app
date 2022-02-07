/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@material-ui/core';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import {
    BaseResponse,
    FileModel,
    ListResponse,
    Show,
    ShowsFilter,
    ShowsQueryRequest,
} from 'src/types';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import { CustomLoader, ShowsSortBy, VideoPlayer } from 'src/components';
import ShowsToggle from '../../shows/showsToggle';
import ShowList from '../../shows/showList';
import BandYTVideo from 'src/types/band/bandYTVideo';
import ReactPlayer from 'react-player/youtube';
import { YOUTUBE_URL } from 'src/constants/appConstants';
import CustomYTPlayer from 'src/components/custom/customYTPlayer';

type OverviewTabProps = {
    bandId: string;
};

const SHOWS_BUFFER = 5;

const OverviewTab = ({ bandId }: OverviewTabProps) => {
    const [isLoading, setLoading] = useState(false);
    const [principalVideos, setPrincipalVideos] = useState<FileModel[]>([]);
    const [principalYTVideos, setPrincipalYTVideos] = useState<BandYTVideo[]>(
        []
    );
    const [showsFilter, setShowsFilter] = useState<ShowsFilter>(
        ShowsFilter.Upcoming
    );
    const [shows, setShows] = useState<Show[]>([]);

    const loadShows = async () => {
        setLoading(true);
        const sorting =
            showsFilter === ShowsFilter.Past
                ? ShowsSortBy.DateDesc
                : ShowsSortBy.Date;
        const request: ShowsQueryRequest = {
            bandId,
            filter: showsFilter,
            maxResultCount: SHOWS_BUFFER,
            skipCount: 0,
            sorting,
        };
        const url = `${
            ApiRoutes.Shows.FromBandWithQuery
        }?${queryString.stringify(request)}`;
        const response: BaseResponse<ListResponse<Show>> = await Api.get(url);
        const { data, success } = response;
        if (success) {
            setShows(data.items);
        }
        setLoading(false);
    };

    const loadPrincipalMedias = async () => {
        if (bandId) {
            const response: BaseResponse<string[]> = await Api.get(
                ApiRoutes.Bands.GetPrincipalMedias(bandId)
            );
            const { data, success } = response;
            if (success) {
                const auxVideos: FileModel[] = [];
                data.forEach((filePath) => {
                    const displayFileModel: FileModel = { srcString: filePath };
                    auxVideos.push(displayFileModel);
                });

                setPrincipalVideos(auxVideos);
            }
        }
    };

    const loadYTVideos = async () => {
        if (bandId) {
            const ytResponse: BaseResponse<BandYTVideo[]> = await Api.get(
                ApiRoutes.YouTubeVideos.GetAllBandVideos(bandId)
            );
            const { data, success } = ytResponse;

            if (success) setPrincipalYTVideos(data.slice(0, 3));
        }
    };

    useEffect(() => {
        loadPrincipalMedias();
        loadYTVideos();
        loadShows();
    }, [bandId]);

    useEffect(() => {
        loadShows();
    }, [showsFilter]);

    const renderVideo = (file: FileModel) => (
        <VideoPlayer videoSrc={file.srcString} />
    );

    const renderPrincipalVideos = () => {
        if (principalVideos && principalVideos.length > 0) {
            const filledVideos = principalVideos.filter((el) => el.srcString);
            const amountOfYTVideos = principalYTVideos.filter(
                (elem) => elem.ytId
            ).length;
            return filledVideos
                .slice(0, 3 - amountOfYTVideos)
                .map((shortVideo, i) => (
                    <Grid key={i} item xs={12} md={3}>
                        {renderVideo(shortVideo)}
                    </Grid>
                ));
        }
        return null;
    };

    const renderYTVideos = () => {
        if (principalYTVideos && principalYTVideos.length > 0) {
            const filledVideos = principalYTVideos.filter((elem) => elem.ytId);
            return filledVideos.map((shortVideo, i) => (
                <Grid key={i} item xs={12} md={3}>
                    <CustomYTPlayer bandYTVideo={shortVideo} />
                </Grid>
            ));
        }
        return null;
    };

    const renderShows = () => (
        <>
            <Grid item xs={12} mt={3} mb={2}>
                <Typography variant="h2">Shows</Typography>
            </Grid>
            <Grid item xs={12}>
                <ShowsToggle
                    value={showsFilter}
                    handleChange={(newValue) => {
                        setShowsFilter(newValue);
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                {isLoading ? (
                    <CustomLoader />
                ) : (
                    <ShowList
                        filter={showsFilter}
                        items={shows}
                        bandId={bandId}
                    />
                )}
            </Grid>
        </>
    );

    return (
        <>
            {renderYTVideos()}
            {renderPrincipalVideos()}
            {renderShows()}
        </>
    );
};

OverviewTab.propTypes = {
    bandId: PropTypes.string.isRequired,
};

export default OverviewTab;
