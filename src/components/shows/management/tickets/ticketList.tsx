import { List } from '@material-ui/core';
import { useTicketInfoStore } from 'src/stores';
import { v4 as uuidv4 } from 'uuid';
import TicketItem from './ticketItem';

const TicketList = () => {
  const { tickets } = useTicketInfoStore((state) => ({ tickets: state.tickets }));

  return (
    <>
      <List sx={{ width: '100%' }}>
        {tickets.map((ticket) => <TicketItem key={ticket.id || uuidv4()} ticket={ticket} />)}
      </List>
    </>
  );
};

export default TicketList;
