/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, memo } from 'react';
import { BandCardModel, Show } from 'src/types';
import { ShowDateTime, ShowInformationLink } from 'src/components';
import {
    Box,
    Divider,
    Grid,
    Typography,
    useMediaQuery,
} from '@material-ui/core';
import { useAuth } from 'src/hooks';
import PropTypes from 'prop-types';
import { ApiRoutes, TrackActions } from 'src/constants';
import TrackService from 'src/services/trackService';
import LikesCount from './likesCount';
import GenreTagsRow from '../../musicalGenres/genreTagsRow';
import NewBandBadge from './newBandBadge';
import UpcomingShows from './upcomingShows';
import BandCardWrapper from './bandCardWrapper';
import ImageWithFavoriteIcon from '../../imageWithFavoriteIcon';

const classes = {
    likesCount: {
        justifyContent: 'left',
    },
    halfRowDistance: {
        marginTop: '5px',
    },
    iconDescription: {
        fontSize: '.7rem',
        paddingLeft: '10px',
    },
    inlineDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationText: {
        fontSize: '.75rem',
        color: '#696A72',
    },
    pointer: {
        cursor: 'pointer',
    },
    rowDistance: {
        marginTop: '8px',
        marginBottom: '8px',
    },
    showTitle: {
        fontSize: '.6rem',
        paddingTop: '5px',
    },
    title: {
        fontSize: '.9rem',
    },
    upcomingShows: {
        justifyContent: { sm: 'flex-end' },
    },
} as const;

type BandCardProps = {
    model: BandCardModel;
};

const getShortAddress: (show: Show) => string = (show: Show) => {
    const { address } = show;
    let shortAddress = '';
    if (address) {
        const { city, formatted, state } = address;
        shortAddress += city ? `${city}, ` : '';
        shortAddress += state || '';
        if (!shortAddress) shortAddress = formatted;
    }
    return shortAddress;
};

const BandCard = ({ model }: BandCardProps) => {
    const { nextShow: show, profilePictureId } = model;
    const [imgString] = useState(
        profilePictureId ? ApiRoutes.Files.GetFile(profilePictureId) : ''
    );
    const [isFavorite, setFavorite] = useState(model.likedBand);
    const [likesCount, setLikesCount] = useState(model.likesCount ?? 0);
    const { user } = useAuth();
    const mdUp: boolean = useMediaQuery((theme: any) =>
        theme.breakpoints.up('md')
    );

    const renderShowInfos = () => {
        return (
            <>
                <Grid sx={{ ...classes.rowDistance }} item xs={12}>
                    <Divider style={{ color: '#E1E1E1' }} />
                </Grid>
                <Grid item xs={10}>
                    <Grid item xs={12}>
                        <ShowDateTime spaceBetween={5} date={show.date} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            sx={{ ...classes.locationText }}
                            variant='body1'
                        >
                            {show.venueName} • {getShortAddress(show)}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        height='100%'
                        width='100%'
                    >
                        <ShowInformationLink description={show.description} />
                    </Box>
                </Grid>
            </>
        );
    };

    const renderGenres = (genres: string[] | null) => (
        <GenreTagsRow paddingTop={10} genres={genres} />
    );

    const renderBandFansOrNew = () => (
        <Grid
            sx={{
                ...classes.halfRowDistance,
                ...classes.inlineDiv,
                ...classes.likesCount,
            }}
            item
            xs={4}
            sm={3}
            md={3}
        >
            {likesCount > 0 ? (
                <LikesCount likesCount={likesCount} />
            ) : (
                <NewBandBadge />
            )}
        </Grid>
    );

    const renderUpcomingShows = () => (
        <Grid
            sx={{
                ...classes.halfRowDistance,
                ...classes.inlineDiv,
                ...classes.upcomingShows,
            }}
            item
            xs={8}
            sm={4}
            md={6}
        >
            <UpcomingShows showsCount={model.upcomingShows} />
        </Grid>
    );

    const handleFavoriteClick = async (like: boolean) => {
        const trackPayload = {
            bandId: model.id,
            bandName: model.name,
        };
        setLikesCount(like ? likesCount + 1 : likesCount - 1);
        TrackService.trackAction(
            like
                ? TrackActions.USER_LIKED_BAND
                : TrackActions.USER_DISLIKED_BAND,
            trackPayload,
            user
        );
        setFavorite(like);
    };

    const renderAccordingScreenSize = () => {
        if (mdUp) {
            return (
                <>
                    {renderUpcomingShows()}
                    {renderGenres(model.genreTags)}
                    {renderBandFansOrNew()}
                </>
            );
        }

        return (
            <>
                {renderBandFansOrNew()}
                {renderUpcomingShows()}
                {renderGenres(model.genreTags)}
            </>
        );
    };

    const renderCardTop = () => (
        <ImageWithFavoriteIcon
            bandId={model.id}
            isFavorite={isFavorite}
            handleFavoriteClick={async (newValue: boolean) => {
                handleFavoriteClick(newValue);
            }}
            imgString={imgString}
            imgTitle={model.name}
        />
    );

    return (
        <BandCardWrapper bandId={model.id} cardTop={renderCardTop()}>
            <>
                <Grid item xs={12} md={6} sx={{ ...classes.title }}>
                    <Typography variant='h2'>{model.name}</Typography>
                </Grid>
                {renderAccordingScreenSize()}
                {model.nextShow && renderShowInfos()}
            </>
        </BandCardWrapper>
    );
};
export default BandCard;
