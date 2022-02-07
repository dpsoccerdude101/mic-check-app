import { Box, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import QrCodeDialog from 'src/components/qrcode/dialog';
import { UiRoutes } from 'src/constants';
import TicketOrderConfirmationService from 'src/services/ticketOrderConfirmationService';
import TicketOrderConfirmation from 'src/types/tickets/ticketOrderConfirmationInfo';
import { useAuth } from 'src/hooks';
import uiRoutes from 'src/constants/uiRoutes';
import Info from './info';
import GrayDivider from './grayDivider';

const TicketOrderConfirmationBody = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();

  const [ticketOrderConfirmation, setTicketOrderConfirmation] = useState(
    null as TicketOrderConfirmation
  );

  const fetchTicketOrderConfirmation = useCallback(async () => {
    if (!id) return;
    const response = await TicketOrderConfirmationService.getByOrderId(
      id.toString()
    );
    if (response.success) setTicketOrderConfirmation(response.data);
  }, [id]);

  useEffect(() => {
    fetchTicketOrderConfirmation();
  }, [fetchTicketOrderConfirmation]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewTicketClick = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const onVerifyClick = (e) => {
    e.preventDefault();
    const returnUrl = router.asPath;
    router.push(
      UiRoutes.Auth.VerifyFanEmailWithReturnUrl(
        ticketOrderConfirmation.validationId,
        returnUrl
      )
    );
  };
  const onLoginClick = (e) => {
    e.preventDefault();
    router.push(uiRoutes.Auth.Login);
  };
  const onMyPlansClick = (e) => {
    e.preventDefault();
    router.push(uiRoutes.Fans.MyPlans);
  };

  const renderSaveTicket = () => (
    <>
      <Box>
        <Typography variant='body1'>
          To save your ticket to your device,
          {' '}
          <a href='#' onClick={handleViewTicketClick}>
            download your ticket
          </a>
        </Typography>
      </Box>
    </>
  );

  const ticketPath = () => {
    if (isAuthenticated) {
      return (
        <>
          {'go to '}
          <a href='#' onClick={onMyPlansClick}>
            My Plans
          </a>
        </>
      );
    } if (ticketOrderConfirmation.needsValidation) {
      return (
        <a href='#' onClick={onVerifyClick}>
          verify your account
        </a>
      );
    }
    return (
      <a href='#' onClick={onLoginClick}>
        login
      </a>
    );
  };

  const renderAccessTicketOnline = () => (
    <>
      <Box>
        <Typography variant='body1'>
          To view your ticket online,
          {' '}
          {ticketPath()}
        </Typography>
      </Box>
    </>
  );

  const render = () => {
    if (id && ticketOrderConfirmation) {
      return (
        <>
          <Box sx={{ pt: 2 }}>
            <Info info={ticketOrderConfirmation} />
          </Box>
          <GrayDivider my={2} />
          <Box px={2} pb={1}>
            <Typography variant='h2'>Where&apos;s my ticket?</Typography>
          </Box>
          <Box px={2} py={1}>
            {renderSaveTicket()}
          </Box>
          <Box px={2} py={1}>
            {renderAccessTicketOnline()}
          </Box>
          <QrCodeDialog
            header={(
              <Typography variant='caption'>
                Click to download
              </Typography>
            )}
            contentIds={ticketOrderConfirmation.ticketInstances.map(x => x.id)}
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
          />
        </>
      );
    }
    return null;
  };

  return render();
};

export default TicketOrderConfirmationBody;
