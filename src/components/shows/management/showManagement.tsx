import { useEffect } from 'react';
import { Grid, Typography, ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useShowStore, useTicketInfoStore, useTicketInstanceStore } from 'src/stores';
import { useAuth } from 'src/hooks';
import type { Show } from 'src/types';
import DetailsTab from './tabs/detailsTab';
import TicketManagementTab from './tabs/ticketManagementTab';
import ManagementTabsEnum from './managementTabsEnum';

type ShowManagementProps = {
  bandId: string;
  show?: Show;
};

const ShowManagement = ({ bandId, show }: ShowManagementProps) => {
  const { user } = useAuth();
  const { id, setId, clear, selectedTab, changeTab, setCurrentShow } = useShowStore((state) => (
    {
      id: state.id,
      setId: state.setId,
      clear: state.clear,
      changeTab: state.changeTab,
      selectedTab: state.selectedTab,
      setCurrentShow: state.setCurrentShow,
    }
  ));
  const { clearTickets, setTickets } = useTicketInfoStore((state) => (
    {
      clearTickets: state.clear,
      setTickets: state.setTickets
    }));
  const { setShow } = useTicketInstanceStore((state) => (
    {
      setShow: state.setShow,
    }
  ));

  useEffect(() => {
    if (!show) {
      clear();
      clearTickets();
    } else {
      setId(show.id);
      setTickets(show.ticketInfos);
      setShow(show);
      setCurrentShow(show);
    }
  }, []);

  const getTitle = () => {
    if (user.isAdmin) return 'Show Management';
    let title = show ? 'Edit' : 'Add';
    title += ' Show';
    return title;
  };

  const renderTabSwitch = () => (
    user.isAdmin
    && (
      <Grid item xs={12}>

        <ToggleButtonGroup
          value={selectedTab}
          onChange={
            (e, newValue) => {
              if (newValue) { changeTab(newValue); }
            }
          }
          exclusive
          aria-label='Shows Filter'
          sx={{ pb: 2, pt: 3 }}
        >
          <ToggleButton value={ManagementTabsEnum.Details} aria-label='Details'>Details</ToggleButton>
          {(id || show) && (
            <ToggleButton
              style={{ marginLeft: 10 }}
              value={ManagementTabsEnum.TicketManagement}
              aria-label='Past shows'
            >
              Ticket Management
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Grid>
    )
  );

  const renderSelectedTab = () => {
    if (selectedTab === ManagementTabsEnum.Details) { return <DetailsTab bandId={bandId} show={show} />; }

    return <TicketManagementTab bandId={bandId} show={show} />;
  };

  return (
    <Grid sx={{ pb: 2 }} container spacing={3} direction='row' alignItems='stretch'>
      <Grid item xs={6} md={8} lg={9} style={{ alignItems: 'center', display: 'flex' }}>
        <Typography variant='h1'>
          {getTitle()}
        </Typography>
      </Grid>
      {renderTabSwitch()}
      <Grid item xs={12}>
        {renderSelectedTab()}
      </Grid>
    </Grid>
  );
};

ShowManagement.propTypes = {
  bandId: PropTypes.string,
  show: PropTypes.any
};

export default ShowManagement;
