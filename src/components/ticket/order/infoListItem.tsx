import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
} from '@material-ui/core';
import { TicketInfo, TicketOrderItem } from 'src/types';
import { Formatter } from 'src/utils';
import { Colors } from 'src/constants';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTicketInstanceStore } from 'src/stores';
import SmallText from './smallText';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 100,
    },
}));

type InfoListItemProps = {
    info: TicketInfo;
};

const InfoListItem = ({ info }: InfoListItemProps) => {
    const [ticketCount, setTicketCount] = useState(0);
    const { id, endDate, name, maximumPerUser, price } = info;
    const { updateOrderItem } = useTicketInstanceStore((state) => ({
        updateOrderItem: state.updateOrderItem,
    }));
    const classes = useStyles();
    const salesDateStr = Formatter.formatDateLiteral(endDate);
    const quantities = Array.from(
        { length: maximumPerUser + 1 },
        (v, k) => k - 1 + 1
    );

    const handleChange = (e) => {
        const quantity = parseInt(e.target.value, 10);
        setTicketCount(quantity);
        const orderItem: TicketOrderItem = {
            id,
            name,
            price,
            quantity,
        };
        updateOrderItem(id, orderItem);
    };

    return (
        <Box display="flex" width="100%" sx={{ pb: 2 }}>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                flexGrow={1}
            >
                <Typography variant="h2" component="span" color="primary">
                    {name}
                </Typography>
                <SmallText text={Formatter.formatMoney(price)} />
                <Typography
                    variant="h3"
                    component="span"
                    color={Colors.COLOR_5}
                    fontWeight={500}
                    fontSize=".6rem"
                >
                    {`Sales end on ${salesDateStr}`}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id={`quantity-label-${id}`}>
                        Quantity
                    </InputLabel>
                    <Select
                        labelId={`quantity-label-${id}`}
                        id={`quantity-select-${id}`}
                        value={ticketCount}
                        onChange={handleChange}
                        label="Quantity"
                    >
                        {quantities.map((value) => (
                            <MenuItem key={uuidv4()} value={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default InfoListItem;
