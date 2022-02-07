import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  Paper,
} from '@material-ui/core';
import { useTicketScanStore } from 'src/stores';
import ScanForShowButton from './scanForShowButton';

const ScanningStatus = () => {
  const { isScanning } = useTicketScanStore((state) => ({ isScanning: state.isScanning }));

  const renderScanningAlert = () => {
    if (isScanning) {
      return (
        <Alert severity='success'>
          <AlertTitle>
            Setup successful!
          </AlertTitle>
          You can now begin scanning tickets for
          this show
        </Alert>
      );
    }
    return (
      <Alert severity='info'>
        <AlertTitle>
          Not scanning for this show
        </AlertTitle>
        Click the Start Scanning button to begin
      </Alert>
    );
  };

  return (
    <Box my={2}>
      <Paper elevation={2}>
        <Box p={2}>
          <Grid container alignItems='center' spacing={2}>
            <Grid item xs={12} sm={9} md={10}>
              <Box>
                {renderScanningAlert()}
              </Box>
            </Grid>
            <Grid
              item
              display='flex'
              justifyContent='center'
              xs={12}
              sm={3}
              md={2}
            >
              <ScanForShowButton />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default ScanningStatus;
