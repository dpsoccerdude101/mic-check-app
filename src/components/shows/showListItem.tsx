import { Api } from 'src/utils';
import ApiRoutes from 'src/constants/apiRoutes';
import DeleteIcon from '@material-ui/icons/Delete';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import formatter from 'src/utils/formatter';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
    Avatar,
    Box,
    IconButton,
    Typography,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Show } from 'src/types';
import { isMobile } from 'react-device-detect';
import { UiRoutes } from 'src/constants';
import { useAuth, useDialog } from 'src/hooks';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import type { SetDialogProps } from 'src/types';
import ImGoingButton from '../fans/imGoingButton';
import ShowInformationLink from './showInformationLink';
import GetOrShowTicketButton from './getOrShowTicketButton';
import { useCallback, useEffect, useState } from 'react';
import { TicketService } from 'src/services';

const useStyles = makeStyles({
    img: {
        borderRadius: 5,
        objectFit: 'cover',
        width: 120,
        height: 80,
        marginRight: 20,
    },
});

type ShowListItemProps = {
    bandId?: string;
    isPast: boolean;
    show: Show;
};

const ShowListItem = ({ bandId, isPast, show }: ShowListItemProps) => {
    const { id, date, name, venueName, address, pictureId } = show;
    const classes = useStyles();
    const router = useRouter();
    const theme = useTheme();
    const { showDialog } = useDialog();
    const { enqueueSnackbar } = useSnackbar();
    const { user, isAuthenticated } = useAuth();

    const formattedDate = `${formatter.formatDateToString(
        date
    )}, ${formatter.formatTime(date)}`;
    const labelId = `show-list-label-${id}`;
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const confirmDelete = () => {
        const dialogProps: SetDialogProps = {
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete this show?',
            submitText: 'OK',
            submitHandler: async () => {
                const response = await Api.delete(
                    ApiRoutes.Shows.Delete(show.id)
                );
                const { message, success } = response;
                if (success) {
                    router.reload();
                } else {
                    enqueueSnackbar(message, { variant: 'error' });
                }
            },
            cancelText: 'Cancel',
        };
        showDialog(dialogProps);
    };

    const getShowDirectionsLink = () => {
        // see page for reference info - https://gearside.com/easily-link-to-locations-and-directions-using-the-new-google-maps/
        const baseLink = 'https://maps.google.com?q=';
        let link = baseLink;
        link += `${show.venueName}+${address.number}+${address.street}+${address.city}+${address.state}`;
        link = link.replaceAll(',', '');
        link = link.replaceAll(' ', '+');
        return link;
    };

    const getAddressString = () => {
        if (address.city && address.state) {
            return `${address.city}, ${address.state}`;
        }

        return address.formatted;
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        confirmDelete();
    };

    const handleEditClick = (event) => {
        event.stopPropagation();
        router.push(UiRoutes.Shows.Edit(show.id));
    };

    const renderTicketButtonIfNeeded = (sourceBandId: string) => {
        if (sourceBandId && show.ticketInfos.length === 0) {
            return null;
        }

        return (
            <GetOrShowTicketButton show={show} sourceBandId={sourceBandId} />
        );
    };

    const auth = useAuth();
    const [ticketInstanceId, setTicketInstanceId] = useState(null as string);
    useEffect(() => {
        (async () => {
            if (!auth.isAuthenticated) return;
            const response = await TicketService.getUserTickets({
                showId: show.id,
            });
            if (response.success && response.data.length > 0)
                setTicketInstanceId(response.data[0].id);
        })();
    }, [show]);

    const getShowBandId = () => {
        console.log('getShowBandId() show.bands', show.bands);
        return show.bands && show.bands.length > 0 ? show.bands[0].bandId : '';
    };

    const renderListItemButtons = () => {
        if (
            !isAuthenticated ||
            user.isFan ||
            (user.isBandMember && !user.isAdmin)
        ) {
            if (isPast) return null;
            // const showBandId = getShowBandId();
            return (
                <>
                    <Box component="span" display="flex" alignItems="center">
                        {renderTicketButtonIfNeeded(bandId)}
                        {!ticketInstanceId && (
                            <Box component="span">
                                <ImGoingButton
                                    bandId={bandId}
                                    showId={show.id}
                                />
                            </Box>
                        )}

                        <Box display="flex" flexDirection="column" pl={2}>
                            <a
                                target="_blank"
                                href={getShowDirectionsLink()}
                                rel="noreferrer"
                            >
                                Directions
                            </a>

                            <Box mt={1}>
                                <ShowInformationLink
                                    description={show.description}
                                />
                            </Box>
                        </Box>
                    </Box>
                </>
            );
        }

        const loggedUserBandId = (user as any)?.bandId;
        const userCanEdit = show.bands
            .map((el) => el.bandId)
            .includes(loggedUserBandId);

        if (!userCanEdit) return (<ShowInformationLink description={show.description} />);

        const bandMemberOnAnotherBandProfile =
            bandId && loggedUserBandId !== bandId;
        if (bandMemberOnAnotherBandProfile) return null;

        return (
            <>
                <Box component="span" display="flex" alignItems="center">
                    <ShowInformationLink description={show.description} />
                    {!isPast && (
                        <Box pl={2} component="span">
                            <IconButton
                                aria-label="edit"
                                onClick={(e) => handleEditClick(e)}
                            >
                                <EditOutlinedIcon />
                            </IconButton>
                        </Box>
                    )}
                    <Box component="span" pl={isPast ? 0 : 2}>
                        <IconButton
                            aria-label="delete"
                            onClick={(e) => handleDeleteClick(e)}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </>
        );
    };

    const openShowDirections = () => {
        // fixing bug on mobile that shows strange dialog
        if (isMobile) return;
        const href = getShowDirectionsLink();
        window.open(href, '_blank');
    };

    return (
        <ListItem
            button
            key={id}
            role={undefined}
            onClick={() => openShowDirections()}
        >
            {isSmUp && (
                <ListItemAvatar>
                    <Avatar
                        src={ApiRoutes.Files.GetFile(pictureId)}
                        alt={name}
                        className={classes.img}
                    />
                </ListItemAvatar>
            )}
            <ListItemText
                id={labelId}
                primary={formattedDate}
                secondary={
                    <>
                        <Box
                            component="span"
                            display="flex"
                            alignItems="center"
                            pt={2}
                        >
                            <Typography
                                gutterBottom
                                component="span"
                                variant="body2"
                                color="textPrimary"
                            >
                                {venueName}
                            </Typography>
                        </Box>
                        <Box component="span" display="flex" pt={1}>
                            <Box
                                component="span"
                                display="flex"
                                alignItems="center"
                            >
                                <LocationOnOutlinedIcon fontSize="small" />
                                <Typography
                                    gutterBottom
                                    component="span"
                                    variant="body1"
                                    color="textPrimary"
                                >
                                    {getAddressString()}
                                </Typography>
                            </Box>
                        </Box>
                        {!isSmUp && (
                            <Box
                                component="span"
                                display="flex"
                                alignItems="center"
                                pt={1}
                            >
                                {renderListItemButtons()}
                            </Box>
                        )}
                    </>
                }
            />
            <ListItemSecondaryAction>
                {isSmUp && renderListItemButtons()}
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default ShowListItem;
