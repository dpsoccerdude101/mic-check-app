import { Box, Typography, makeStyles } from '@material-ui/core';
import { TicketIcon } from 'src/constants/icons';
import AddTicketButton from './addTicketButton';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2)
  }
}));

const NoTicketsPlaceholder = () => {
  const classes = useStyles();

  return (
    <Box
      display='flex'
      height='35vh'
      width='100%'
      alignItems='center'
      justifyContent='space-between'
      className={classes.root}
      flexDirection='column'
    >
      <img alt='MicCheck Ticket' src={TicketIcon} />
      <Typography variant='h2'>Need to sell tickets?</Typography>
      <Typography variant='body1'>Use Mic Check to sell tickets for your show.</Typography>
      <AddTicketButton />
    </Box>
  );
};

export default NoTicketsPlaceholder;
