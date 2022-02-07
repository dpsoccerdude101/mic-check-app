import { Button, makeStyles } from '@material-ui/core';
import { useTicketInfoStore } from 'src/stores';

const useStyles = makeStyles({
  root: {
    padding: '15px 30px'
  }
});

const AddTicketButton = () => {
  const classes = useStyles();
  const { clearTicket, showTicketForm } = useTicketInfoStore(
    (state) => (
      {
        clearTicket: state.clearTicket,
        showTicketForm: state.showTicketForm
      }
    )
  );

  return (
    <Button
      className={classes.root}
      variant='contained'
      color='primary'
      onClick={() => {
        clearTicket();
        showTicketForm();
      }}
    >
      Add Ticket
    </Button>
  );
};

export default AddTicketButton;
