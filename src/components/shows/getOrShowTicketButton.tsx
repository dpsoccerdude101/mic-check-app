import { Box } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import TicketService from 'src/services/ticketService';
import { Show } from 'src/types';
import GetTicketButton from './getTicketButton';
import ShowTicketButton from './showTicketButton';

type GetOrShowTicketButtonProps = {
    show: Show;
    sourceBandId: string;
};

const GetOrShowTicketButton = ({
    show,
    sourceBandId,
}: GetOrShowTicketButtonProps) => {
    const [ticketInstanceIds, setTicketInstanceIds] = useState(null as string[]);

    let isActive = false;

    const fetchTicketInstanceId = useCallback(async () => {
        const response = await TicketService.getUserTickets({
            showId: show.id,
        });

        if (isActive && response.success && response.data.length > 0)
            setTicketInstanceIds(response.data.map(x => x.id));
    }, [show]);

    useEffect(() => {
        isActive = true;
        fetchTicketInstanceId();
        return () => {
            isActive = false;
        };
    }, [fetchTicketInstanceId]);

    return (
        <>
            <Box component="span" pr={2} style={{ marginTop: 5 }}>
                {ticketInstanceIds ? (
                    <ShowTicketButton ticketInstanceIds={ticketInstanceIds} />
                ) : (
                    <GetTicketButton show={show} sourceBandId={sourceBandId} />
                )}
            </Box>
        </>
    );
};

export default GetOrShowTicketButton;
