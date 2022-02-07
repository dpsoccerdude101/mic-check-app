import { Formatter } from 'src/utils';
import {
    Grid,
    Typography,
    makeStyles,
    Box,
    useMediaQuery,
} from '@material-ui/core';
import { Address } from 'src/types';
import ImGoingButton from 'src/components/fans/imGoingButton';
import ShowTicketButton from './showTicketButton';

const useStyles = makeStyles((theme) => ({
    distBetweenLines: {
        paddingTop: 10,
    },
    smallFontForAddress: {
        [theme.breakpoints.only('xs')]: {
            fontSize: '.6rem',
        },
        [theme.breakpoints.only('sm')]: {
            fontSize: '.7rem',
        },
    },
}));

type ShowCardSmallDetailsProps = {
    bandId: string;
    showId: string;
    date: Date;
    address: Address;
    venueName: string;
    showIsGoingButton: boolean;
    ticketInstanceIds?: string[];
};

const ShowCardSmallDetails = ({
    address,
    bandId,
    date,
    venueName,
    showId,
    showIsGoingButton,
    ticketInstanceIds,
}: ShowCardSmallDetailsProps) => {
    const classes = useStyles();

    const dateString = Formatter.formatDateToString(date);
    const timeString = Formatter.formatTime(date);
    const smUp: Boolean = useMediaQuery((theme: any) =>
        theme.breakpoints.up('sm')
    );

    const smallAddress = () => {
        let text = '';
        if (address) {
            if (address.city) {
                text = `${address.city}, `;
            }

            if (address.state) {
                text += address.state;
            }
        }
        return text;
    };

    const imGoingButton = (props?: any) => (
        <ImGoingButton
            bandId={bandId}
            showId={showId}
            buttonProps={{ ...props }}
        />
    );

    const showTicketButton = (props?: any) => (
        <ShowTicketButton
            ticketInstanceIds={ticketInstanceIds}
            buttonProps={{ size: 'medium', ...props }}
        />
    );

    const xsButtonsDisplay = () => (
        <>
            <Box component="div">
                {showIsGoingButton &&
                    imGoingButton({ style: { width: '100%' } })}
            </Box>
            <Box mt={1}>
                {ticketInstanceIds &&
                    showTicketButton({ style: { width: '100%' } })}
            </Box>
        </>
    );

    const smUpButtonsDisplay = () => (
        <Box display="flex" alignItems="center">
            {showIsGoingButton && <Box mr={2}>{imGoingButton()}</Box>}
            {ticketInstanceIds && showTicketButton()}
        </Box>
    );
    return (
        <>
            <Grid item xs={6}>
                <Typography variant="h2">{dateString}</Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
                <Typography variant="body2">{venueName}</Typography>
            </Grid>
            <Grid className={classes.distBetweenLines} item xs={6}>
                <Typography variant="body1">{timeString}</Typography>
            </Grid>
            <Grid item xs={1} />
            <Grid className={classes.distBetweenLines} item xs={5}>
                <Typography
                    className={classes.smallFontForAddress}
                    variant="body2"
                >
                    {smallAddress()}
                </Typography>
            </Grid>
            {(showIsGoingButton || ticketInstanceIds) && (
                <Grid className={classes.distBetweenLines} item xs={12}>
                    {smUp ? smUpButtonsDisplay() : xsButtonsDisplay()}
                </Grid>
            )}
        </>
    );
};

export default ShowCardSmallDetails;
