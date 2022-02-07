import { Box, Grid, Link, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import QrCodeDialog from 'src/components/qrcode/dialog';
import { UiRoutes } from 'src/constants';
import TicketOrderConfirmationService from 'src/services/ticketOrderConfirmationService';
import { useNavigationStore } from 'src/stores';
import GuestCheckoutForm from './guestCheckoutForm';

// TODO: this is not named well... we've got much more in the form component than we should have
const GuestCheckoutBody = () => {
    return (
        <>
            <GuestCheckoutForm />
        </>
    );
};

export default GuestCheckoutBody;
