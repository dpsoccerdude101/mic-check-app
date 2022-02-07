import { Box, Typography } from '@material-ui/core';
import { useTicketInstanceStore } from 'src/stores';
import BillingInfoForm from './billingInfoForm';

const BillingInfoBody = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            sx={{ px: 2 }}
            width="100%"
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
            >
                <BillingInfoForm />
            </Box>
        </Box>
    );
};

export default BillingInfoBody;
