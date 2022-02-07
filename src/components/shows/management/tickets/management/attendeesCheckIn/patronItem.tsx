import {
  Box,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
  Button,
  CircularProgress,
  ListItemIcon,
  Grid,
} from '@material-ui/core';
import { Pending, Check } from '@material-ui/icons';
import { Colors } from 'src/constants';
import { useShowStore, useTicketScanStore } from 'src/stores';
import TicketInstanceDetailsForScan from 'src/types/tickets/ticketInstanceDetailsForScan';
import formatter from 'src/utils/formatter';
import { TicketService } from 'src/services';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1rem',
    fontWeight: 500,
  },
  grayText: {
    color: Colors.COLOR_5,
    fontSize: '.7rem',
  },
  admitButton: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  statusAdmitted: {
    color: theme.palette.success.main,
  },
  statusDenied: {
    color: theme.palette.error.main,
  },
  statusUnkown: {
    color: theme.palette.grey.A100,
  },
}));

type PatronItemProps = {
  ticket: TicketInstanceDetailsForScan;
};

const PatronItem = ({ ticket }: PatronItemProps) => {
  const classes = useStyles();
  const { updateTicket } = useTicketScanStore((state) => ({ updateTicket: state.updateTicket }));
  const show = useShowStore((state) => state);
  const { enqueueSnackbar } = useSnackbar();

  const admit = async () => {
    const request = {
      ticketInstanceId: ticket.id,
      showId: show.id,
    };
    const response = await TicketService.admitTicket(request);
    const { data, message, success } = response;
    if (success) {
      updateTicket(data);
    } else { enqueueSnackbar(message, { variant: 'error' }); }
  };

  const renderAdmitButton = () => {
    if (ticket.scannedAt) return null;

    return (show && ticket ? (
      <Button
        className={classes.admitButton}
        variant='outlined'
        color='primary'
        onClick={() => admit()}
      >
        Admit
      </Button>
    ) : (
      <CircularProgress />
    ));
  };

  const renderAdmissionStatus = () => (
    ticket.scannedAt
      ? <Check className={classes.statusAdmitted} />
      : <Pending className={classes.statusUnkown} />
  );

  const renderPrimary = () => (
    <Box display='flex' flexDirection='column'>
      <Typography color='primary' fontWeight={600} component='span'>
        {`${ticket.user.name} ${ticket.user.surname}`}
      </Typography>
      <Typography component='span'>{ticket.user.email}</Typography>
    </Box>
  );

  const renderSecondary = () => (
    <Box>
      <Typography component='span'>
        Admitted at:
        {' '}
        {ticket.scannedAt
          ? formatter.formatDateAndTime(ticket.scannedAt)
          : 'Not scanned'}
      </Typography>
    </Box>
  );

  return (
    <>
      <ListItem role={undefined}>
        <ListItemIcon>{renderAdmissionStatus()}</ListItemIcon>
        <Grid container alignItems='center' spacing={1}>
          <Grid item xs={12} sm={9} md={10}>
            <ListItemText
              id={`patron-list-item-user-${ticket.id}`}
              primary={renderPrimary()}
              secondary={renderSecondary()}
            />
          </Grid>
          <Grid
            item
            display='flex'
            justifyContent='center'
            xs={12}
            sm={3}
            md={2}
          >
            {renderAdmitButton()}
          </Grid>
        </Grid>
      </ListItem>
    </>
  );
};

export default PatronItem;
