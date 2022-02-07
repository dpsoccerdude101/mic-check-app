import { useEffect, useState } from 'react';
import { FavoriteBandIcon, GenreTag } from 'src/components';
import PropTypes from 'prop-types';
import { useBand, useAuth } from 'src/hooks';
import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import { Api } from 'src/utils';
import { ApiRoutes, Colors, TrackActions } from 'src/constants';
import TrackService from 'src/services/trackService';
import { BaseResponse } from 'src/types';
import CustomImage from '../../custom/customImage';
import BandProfileContainer from './bandProfileContainer';
import ImageLayer from '../../imageLayer';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: '20px',
        position: 'relative',
        zIndex: 5,
        width: '100%',
        height: 300,
    },
    backgroundImage: {
        objectFit: 'cover',
        objectPosition: 'top',
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: '.8',
        zIndex: -1,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 10,
        [theme.breakpoints.only('xs')]: {
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 0,
        },
        [theme.breakpoints.only('sm')]: {
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 10,
        },
        [theme.breakpoints.only('lg')]: {
            paddingTop: 15,
            paddingBottom: 15,
        },
    },
    firstRow: {
        paddingBottom: '8vh',
    },
    title: {
        color: 'white',
        fontWeight: 600,
    },
    subtitle: {
        color: 'white',
        fontSize: '.7rem',
        fontWeight: 500,
    },
    paddingLeft: {
        paddingLeft: 10,
    },
}));

type BaseBandProfileHeaderProps = {
    bandId: string;
    genreTags: string[];
    imgSrc: string;
    name: string;
    hometown: string;
    isPreview: boolean;
};

type BandProfileFromFanHeaderProps = BaseBandProfileHeaderProps & {
    fanId: string;
    isFavorite: boolean;
};

type BandProfileHeaderProps =
    | BaseBandProfileHeaderProps
    | BandProfileFromFanHeaderProps;

const BandProfileHeader = (props: BandProfileHeaderProps) => {
    const { bandId, hometown, genreTags, imgSrc, name, isPreview } = props;
    const [isFavoriteState, setIsFavorite] = useState(false);
    const [realtimeFansCount, setFansCount] = useState(0);
    const { user, setBandIdForAdmin } = useAuth();
    const classes = useStyles();
    const { setProfilePreview, showPreview } = useBand();

    useEffect(() => {
        if (!isPreview) {
            const { isFavorite } = props as BandProfileFromFanHeaderProps;
            if (isFavorite) {
                setIsFavorite(isFavorite);
            }
        }

        const loadFansCount = async () => {
            const response: BaseResponse<number> = await Api.get(
                ApiRoutes.Bands.GetFansCount(bandId)
            );
            const { success, data } = response;
            if (success) {
                setFansCount(data);
            }
        };

        loadFansCount();
    }, [props]);

    const renderGenreTags = (max: number) => {
        if (!genreTags || genreTags.length === 0) {
            return null;
        }
        let genres: string[] = [];
        if (genreTags.length > max) {
            genres = genreTags.slice(0, max);
        } else {
            genres = genreTags;
        }
        return genres.map((el) => <GenreTag key={el} title={el} />);
    };

    const fansText = () => {
        const number = realtimeFansCount === 0 ? 'No' : realtimeFansCount;
        const label = realtimeFansCount === 1 ? 'Fan' : 'Fans';
        return `${number} ${label}`;
    };

    const handleFavoriteClick = async (like: boolean) => {
        const trackPayload = {
            bandId,
            bandName: name,
        };

        if (like && !isFavoriteState) {
            setFansCount(realtimeFansCount + 1);
            setIsFavorite(like);
            TrackService.trackAction(
                TrackActions.USER_LIKED_BAND,
                trackPayload,
                user
            );
        }

        if (!like && isFavoriteState) {
            setFansCount(realtimeFansCount - 1);
            setIsFavorite(like);
            TrackService.trackAction(
                TrackActions.USER_DISLIKED_BAND,
                trackPayload,
                user
            );
        }
    };

    const handleImpersonateClick = (clear: boolean) => {
        setBandIdForAdmin(clear ? null : bandId);
    };

    const renderImpersonate = () => {
        const { isAdmin } = user ?? { isAdmin: false };
        if (!isAdmin) {
            return null;
        }

        const currentSelectedBand = (user as any).bandId;
        const impersonated = currentSelectedBand === bandId;
        const text = impersonated ? 'Impersonated' : 'Impersonate';

        return (
            <Button
                onClick={() => handleImpersonateClick(impersonated)}
                variant="contained"
                fullWidth
                style={{
                    backgroundColor: impersonated ? Colors.TERTIARY : null,
                    color: impersonated ? 'white' : null,
                }}
                color={impersonated ? 'inherit' : 'primary'}
            >
                {text}
            </Button>
        );
    };

    // It can be the button 'Exit preview' | FavoriteBandIcon | nothing
    const renderFirstRow = () => {
        if (isPreview && showPreview) {
            return (
                <>
                    <Grid item xs={2} sm={6} md={8} lg={8} />
                    <Grid
                        className={classes.firstRow}
                        item
                        xs={4}
                        sm={3}
                        md={2}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => setProfilePreview(false)}
                        >
                            Exit Preview
                        </Button>
                    </Grid>
                    <Grid
                        item
                        className={classes.firstRow}
                        xs={6}
                        sm={3}
                        md={2}
                    >
                        {renderImpersonate()}
                    </Grid>
                </>
            );
        }

        if (!isPreview) {
            return (
                <>
                    <Grid item xs={6} sm={9} md={10}>
                        <FavoriteBandIcon
                            bandId={bandId}
                            isFavorite={isFavoriteState}
                            handleFavoriteClick={async (newValue: boolean) => {
                                handleFavoriteClick(newValue);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                        {renderImpersonate()}
                    </Grid>
                </>
            );
        }

        return null;
    };

    const renderComponentsAccordingWithSize = () => (
        <>
            <Box display="flex" flexDirection="column" mt={4} ml={2}>
                <Box>
                    <Typography variant="h1" color="white">
                        {name}
                    </Typography>
                </Box>
                <Box display="flex" flexDirection="column">
                    <Box mt={1}>{renderGenreTags(5)}</Box>
                    <Box mt={1}>
                        <Typography
                            variant="subtitle1"
                            color="white"
                            component="div"
                        >
                            {fansText()} • {hometown}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );

    return (
        <div className={classes.root}>
            <CustomImage
                className={classes.backgroundImage}
                imgSrc={imgSrc}
                title={name}
            />
            <ImageLayer />
            <BandProfileContainer>
                {renderFirstRow()}
                {renderComponentsAccordingWithSize()}
            </BandProfileContainer>
        </div>
    );
};

BandProfileHeader.propTypes = {
    bandId: PropTypes.string.isRequired,
    genreTags: PropTypes.arrayOf(PropTypes.string).isRequired,
    imgSrc: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    hometown: PropTypes.string,
};

export default BandProfileHeader;
