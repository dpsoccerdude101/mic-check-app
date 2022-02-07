import { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    makeStyles,
    useMediaQuery,
    Grid,
    Box,
} from '@material-ui/core';
import ShowCardSmallDetails from 'src/components/shows/showCardSmallDetails';
import { FanShowPlanDto } from 'src/types';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { NoImagePlaceholder } from 'src/constants/images';
import { formatAddress } from 'src/utils/formatter';
import { useRouter } from 'next/router';
import ShowDateTime from 'src/components/shows/showDateTime';
import ImGoingButton from 'src/components/fans/imGoingButton';
import CustomImage from 'src/components/custom/customImage';
import BandCardWrapper from 'src/components/bands/card/bandCardWrapper';
import CardImage from './cardImage';
import ImageLayer from '../../imageLayer';
import { TicketService } from 'src/services';
import ShowTicketButton from 'src/components/shows/showTicketButton';

const useStyles = makeStyles({
    root: {
        alignItems: 'center',
        borderRadius: 5,
        cursor: 'pointer',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 20,
        paddingBottom: 25,
        marginBottom: 25,
        WebkitBoxShadow: '0px 1px 4px 1px #ececec',
        MozBoxShadow: '0px 1px 4px 1px #ececec',
        BoxShadow: '0px 1px 4px 1px #ececec',
    },
    largeTitle: {
        fontSize: '1.2rem',
        paddingBottom: 15,
        whiteSpace: 'nowrap',
    },
    title: {
        bottom: 30,
        color: 'white',
        left: 20,
        fontSize: '1.2rem',
        fontWeight: 600,
        position: 'absolute',
    },
    wrapper: {
        marginBottom: '3vh',
    },
    dateTime: {
        paddingLeft: 20,
    },
    img: {
        borderRadius: 5,
        objectFit: 'cover',
        width: 130,
        height: 100,
    },
    imgAndDate: {
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        display: 'flex',
        WebkitBoxAlign: 'center',
    },
    middleTextCol: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '105px !important',
    },
});

type MyPlanCardsProps = {
    model: FanShowPlanDto;
};

const MyPlanCard = (props: MyPlanCardsProps) => {
    const classes = useStyles();
    const { model } = props;
    const {
        showId,
        bandId,
        showVenueName: venueName,
        showAddress: address,
        showDate: date,
        bandName,
    } = model;
    const [imgSrc, setImgSrc] = useState(NoImagePlaceholder);
    const router = useRouter();
    const mdDown: Boolean = useMediaQuery((theme: any) =>
        theme.breakpoints.down('md')
    );
    const venueAddress = formatAddress(address);

    const [ticketInstanceIds, setTicketInstanceIds] = useState(null as string[]);

    const fetchTicketInstanceIds = useCallback(async () => {
        const response = await TicketService.getUserTickets({
            showId: model.showId,
        });
        if (response.success && response.data.length > 0)
            setTicketInstanceIds(response.data.map(x => x.id));
    }, [model]);

    useEffect(() => {
        fetchTicketInstanceIds();
    }, [fetchTicketInstanceIds]);

    useEffect(() => {
        const loadImageData = async () => {
            const srcString = ApiRoutes.Files.GetBandPicture(bandId);
            setImgSrc(srcString);
        };

        loadImageData();
    }, [props]);

    const renderHeader = () => (
        <div>
            <CardImage imgSrc={imgSrc} title={venueName} />
            <ImageLayer height="30vh" zIndex={0} />
            <Typography className={classes.title} variant="h2">
                {bandName}
            </Typography>
        </div>
    );

    const redirectToBandProfile = () => {
        router.push(UiRoutes.Bands.Profile(bandId));
    };

    const renderLargeMyPlanCard = () => (
        <Grid
            // onClick={redirectToBandProfile}
            className={classes.root}
            container
            alignItems="stretch"
            direction="row"
        >
            <Grid className={classes.imgAndDate} item md={4}>
                <Box onClick={redirectToBandProfile}>
                    <CustomImage
                        className={classes.img}
                        imgSrc={imgSrc}
                        title="Show"
                    />
                </Box>

                <div className={classes.dateTime}>
                    <Typography
                        onClick={redirectToBandProfile}
                        className={classes.largeTitle}
                        variant="h1"
                        component="h2"
                    >
                        {bandName}
                    </Typography>
                    <ShowDateTime spaceBetween={10} date={date} />
                </div>
            </Grid>
            <Grid item md={2} className={classes.middleTextCol}>
                <Typography variant="body2">{venueName}</Typography>
            </Grid>
            <Grid item md={1} />

            <Grid item md={2} className={classes.middleTextCol}>
                <Typography variant="body2">{venueAddress}</Typography>
            </Grid>
            <Grid item md={1} />
            <Grid item md={2}>
                <Box display="flex" flexDirection="column">
                    {ticketInstanceIds ? (
                        <Box mt={1}>
                            <ShowTicketButton
                                ticketInstanceIds={ticketInstanceIds}
                                buttonProps={{ style: { width: '100%' } }}
                            />
                        </Box>
                    ) : (
                        <ImGoingButton bandId={bandId} showId={showId} />
                    )}
                </Box>
            </Grid>
        </Grid>
    );

    const switchComponentsAccordingWithScreenSize = () => {
        if (mdDown) {
            return (
                <BandCardWrapper
                    bandId={bandId}
                    wrapperClass={classes.wrapper}
                    cardTop={renderHeader()}
                >
                    <>
                        <ShowCardSmallDetails
                            showIsGoingButton={!ticketInstanceIds}
                            bandId={bandId}
                            showId={showId}
                            date={date}
                            address={address}
                            venueName={venueName}
                            ticketInstanceIds={ticketInstanceIds}
                        />
                    </>
                </BandCardWrapper>
            );
        }
        return renderLargeMyPlanCard();
    };

    return switchComponentsAccordingWithScreenSize();
};

export default MyPlanCard;
