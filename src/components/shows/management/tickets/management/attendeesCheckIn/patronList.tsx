import {
  List,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  TextField
} from '@material-ui/core';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { TicketService } from 'src/services';
import { useShowStore, useTicketScanStore } from 'src/stores';
import PatronItem from './patronItem';

const PatronList = () => {
  const showId = useShowStore((state) => state.id);
  const [searchText, setSearchText] = useState<string>('');
  const { ticketList, setTicketList } = useTicketScanStore((state) => ({ ticketList: state.ticketList, setTicketList: state.setTicketList }));

  const getTicketInstancesByShow = async (text) => {
    const response = await TicketService.getDetailsForScanByShowId(
      showId,
      text
    );
    if (response.success) {
      const ticketInstances = response.data;
      setTicketList(ticketInstances);
    }
  };

  useEffect(() => {
    getTicketInstancesByShow('');
  }, []);

  const delayedQuery = useCallback(debounce((q) => getTicketInstancesByShow(q), 500), []);

  const handleChange = (e) => {
    setSearchText(e.target.value);
    delayedQuery(e.target.value);
  };

  return (
    <>
      <Typography variant='h2' mt={3}>
        Patron List
      </Typography>
      <TextField
        sx={{ pt: 2 }}
        placeholder='Search for a patron'
        value={searchText}
        onChange={handleChange}
      />
      <Paper elevation={0}>
        {ticketList ? (
          <List sx={{ width: '100%' }}>
            {ticketList.map((ticket, index) => (
              <Fragment key={ticket.id}>
                <PatronItem ticket={ticket} />
                {index < ticketList.length - 1 && (
                  <Divider variant='inset' component='li' />
                )}
              </Fragment>
            ))}
          </List>
        ) : (
          <CircularProgress />
        )}
      </Paper>
    </>
  );
};

export default PatronList;
