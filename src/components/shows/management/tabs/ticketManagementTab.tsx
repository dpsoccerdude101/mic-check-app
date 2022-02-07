import { useEffect } from 'react';
import { useTicketInfoStore } from 'src/stores';
import NoTicketsPlaceholder from '../tickets/noTicketsPlaceholder';
import TicketForm from '../tickets/ticketForm';
import Management from '../tickets/management/management';
import type { Show } from 'src/types';

type DetailsProps = {
  bandId: string;
  show?: Show;
};

const TicketManagementTab = ({ bandId, show } : DetailsProps) => {
  const { tickets, hideTicketForm, showAddTicketForm } = useTicketInfoStore(
    (state) => (
      {
        hideTicketForm: state.hideTicketForm,
        showAddTicketForm: state.isTicketFormVisible,
        tickets: state.tickets
      })
  );

  useEffect(() => {
    hideTicketForm();
  }, []);

  const render = () => {
    if (showAddTicketForm) { return <TicketForm />; }

    if (tickets.length === 0) { return <NoTicketsPlaceholder />; }

    return <Management bandId={bandId} show={show} />;
  };

  return (
    render()
  );
};

export default TicketManagementTab;
