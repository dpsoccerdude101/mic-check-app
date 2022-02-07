import { useTicketInstanceStore } from 'src/stores';
import { Box, Divider, Typography, makeStyles, TextField } from '@material-ui/core';
import { CircleDot } from 'src/components';
import { Formatter } from 'src/utils';
import { Colors } from 'src/constants';
import { TicketInfo } from 'src/types';

const useStyles = makeStyles((theme) => ({
  divider: {
    width: '100%',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    color: Colors.COLOR_5
  }
}));

const TicketOrder = () => {
  const classes = useStyles();
  const { show } = useTicketInstanceStore((state) => ({ show: state.show }));
  const dot = <CircleDot size='.2rem' color={Colors.PRIMARY} mh='.3rem' />;

  const smallText = (text: string) => (<Typography variant='h3' color='primary' fontWeight={400}>{text}</Typography>);
  const header = () => {
    const dayStr = Formatter.formatDateToDayOfWeek(show.date);
    const dateStr = Formatter.formatDateLiteral(show.date);
    const timeStr = Formatter.formatTime(show.date);

    return (
      <Box
        display='flex'
        alignItems='flex-start'
        flexDirection='column'
        width='100%'
        justifyContent='spaceAround'
      >
        <Typography variant='h2' color='primary'>{show.name}</Typography>
        <Box
          display='inline-flex'
          alignContent='center'
          alignItems='center'
        >
          {smallText(dayStr)}
          {dot}
          {smallText(dateStr)}
          {dot}
          {smallText(timeStr)}
        </Box>
      </Box>
    );
  };

  const orderDetails = () => (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='space-around'
    >
      <Typography
        variant='h4'
        component='span'
        color='primary'
      >
        Order Details
      </Typography>

    </Box>
  );

  const renderTicketInfo = (info: TicketInfo) => {
    const salesDateStr = Formatter.formatDateLiteral(info.endDate);

    return (
      <Box display='flex' width='100%' sx={{ pb: 2 }}>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          flexGrow={1}
        >
          <Typography variant='h2' component='span' color='primary'>{info.name}</Typography>
          {smallText(Formatter.formatMoney(info.price))}
          <Typography
            variant='h3'
            component='span'
            color={Colors.COLOR_5}
            fontWeight={300}
            fontSize='.8rem'
          >
            {`Sales end at ${salesDateStr}`}

          </Typography>
        </Box>
        <Box display='flex' alignItems='center' justifyContent='center'>
          <TextField type='number' value={1} sx={{ width: 60 }} />
        </Box>
      </Box>
    );
  };

  const ticketInfos = () => (
    <Box
      display='flex'
      flexDirection='column'
      flexGrow={1}
      width='100%'
    >
      {show.ticketInfos.map((el) => renderTicketInfo(el))}
    </Box>
  );

  const footer = () => 'footer';
  const divider = () => (<Divider className={classes.divider} />);
  return (
    <Box
      display='flex'
      alignItems='center'
      flexDirection='column'
      height='100%'
      sx={{ px: 2 }}
    >
      {header()}
      {divider()}
      {ticketInfos()}
      {divider()}
      {orderDetails()}
      {divider()}
      {footer()}
    </Box>
  );
};

export default TicketOrder;
