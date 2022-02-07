import {
    Box,
    ListItem,
    ListItemText,
    Typography,
    ListItemSecondaryAction,
    makeStyles,
} from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import CircleDot from 'src/components/circleDot';
import MoreIconMenu, {
    MoreIconMenuItemProps,
} from 'src/components/moreIconMenu';
import type { TicketInfo } from 'src/types';
import { Formatter } from 'src/utils';
import { Colors } from 'src/constants';
import { useTicketInfoStore } from 'src/stores';
import { useEffect, useState } from 'react';
import { TicketService } from 'src/services';

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: '1rem',
        fontWeight: 500,
    },
    item: {
        WebkitBoxShadow: '0px 1px 4px 1px #ececec',
        MozBoxShadow: '0px 1px 4px 1px #ececec',
        BoxShadow: '0px 1px 4px 1px #ececec',
        padding: '25px 35px',
        borderRadius: 20,
        marginBottom: theme.spacing(2),
    },
    grayText: {
        color: Colors.COLOR_5,
        fontSize: '.7rem',
    },
}));

type TicketItemProps = {
    ticket: TicketInfo;
};

const TicketItem = ({ ticket }: TicketItemProps) => {
    const classes = useStyles();
    const { setCurrentTicket, showTicketForm } = useTicketInfoStore(
        (state) => ({
            setCurrentTicket: state.setCurrentTicket,
            showTicketForm: state.showTicketForm,
        })
    );
    const [sold, setSold] = useState(0);

    useEffect(() => {
        (async () => {
            const response = await TicketService.getRemainingTickets(
                ticket.id,
                ticket.maximumCapacity
            );
            if (response.success)
                setSold(ticket.maximumCapacity - response.data.remaining);
        })();
    }, []);

    const isStillOnSale = new Date() < new Date(ticket.endDate);

    const confirmDelete = () => {
        // TODO: Delete
    };

    const priceText = (price: number) => {
        if (price === 0) return 'Free';
        return `$${price}`;
    };

    const soldText = () => `${sold}/${ticket.maximumCapacity}`;

    const renderSoldPriceAndActions = () => {
        const items: MoreIconMenuItemProps[] = [
            {
                Icon: <Edit fontSize="small" />,
                title: 'Edit',
                handleClick: async () => {
                    setCurrentTicket(ticket);
                    showTicketForm();
                },
            },
            {
                Icon: <Delete fontSize="small" />,
                title: 'Delete',
                handleClick: async () => confirmDelete(),
            },
        ];

        return (
            <Box component="span" display="flex" alignItems="center">
                <Box component="span">
                    <Typography className={classes.grayText} variant="body1">
                        {soldText()}
                    </Typography>
                </Box>
                <Box component="span" pl={15}>
                    <Typography className={classes.grayText} variant="body1">
                        {priceText(ticket.price)}
                    </Typography>
                </Box>
                <Box pl={6}>
                    <MoreIconMenu items={items} />
                </Box>
            </Box>
        );
    };

    const renderTitle = (title: string) => (
        <Typography
            sx={{ pb: 1 }}
            className={classes.title}
            variant="h3"
            color="primary"
            component="span"
        >
            {title}
        </Typography>
    );

    const getState = () => {
        const color = isStillOnSale ? 'green' : 'red';
        return <CircleDot color={color} size=".5rem" />;
    };

    const salesText = () => {
        const dateStr = Formatter.formatDateLiteral(ticket.endDate);
        const timeStr = Formatter.formatTime(ticket.endDate);
        const prefixStr = isStillOnSale ? 'On sale until ' : 'Sales ended on ';
        return `${prefixStr} ${dateStr} at ${timeStr}`;
    };

    const renderSaleStatusAndDate = () => (
        <Box display="flex" alignItems="center">
            {getState()}
            <Typography
                pl={1}
                variant="body1"
                component="span"
                className={classes.grayText}
            >
                {salesText()}
            </Typography>
        </Box>
    );

    return (
        <ListItem className={classes.item} role={undefined}>
            <ListItemText
                id={`ticket-list-label-id${ticket.id}`}
                primary={renderTitle(ticket.name)}
                secondary={renderSaleStatusAndDate()}
            />
            <ListItemSecondaryAction>
                {renderSoldPriceAndActions()}
            </ListItemSecondaryAction>
        </ListItem>
    );
};

export default TicketItem;
