import dynamic from 'next/dynamic';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { useShowStore, useTicketScanStore } from 'src/stores';
import { TicketService } from 'src/services';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { CustomDialog } from 'src/components';
import CustomLoader from 'src/components/custom/customLoader';

const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false });

const useStyles = makeStyles({
  scanner: {
    width: '100%'
  }
});

const DELAY_MS = 1000;

const Scanner = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [showDialog, setShowDialog] = useState(false);
  const [patronName, setPatronName] = useState('');

  const {
    isScanning,
    isLoading,
    setLoading,
    updateTicket
  } = useTicketScanStore(
    (state) => (
      {
        isScanning: state.isScanning,
        isLoading: state.isLoading,
        setLoading: state.setLoading,
        updateTicket: state.updateTicket
      })
  );
  const { id } = useShowStore((state) => (
    {
      id: state.id
    }
  ));
  const classes = useStyles();

  const handleError = (e) => {
    console.log('Error: ', e);
  };

  const handleScan = async (e) => {
    if (e) {
      setLoading(true);
      const scanResponse = await TicketService.scanTicket({ showId: id, ticketHash: e });
      const { data, message, success } = scanResponse;
      const toastType = success ? 'success' : 'error';
      if (success) {
        setShowDialog(true);
        setPatronName(`${data.user.name} ${data.user.surname}`);
        updateTicket(data);
      } else {
        setLoading(false);
      }
      enqueueSnackbar(message, { variant: toastType });
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setLoading(false);
  };

  const scannedUserDialog = () => (
    <CustomDialog
      open={showDialog}
      title='Valid Ticket'
      text=''
      closeDialogFunc={async () => closeDialog()}
      submitText='Ok'
      submitHandler={async () => closeDialog()}
    >
      <Grid container spacing={1}>
        <Grid item xs={12} sm={3} alignSelf='center'>
          <Typography variant='h3'>{patronName}</Typography>
        </Grid>
      </Grid>
    </CustomDialog>
  );

  const scannerOrLoading = () => {
    if (isLoading) return <CustomLoader />;
    if (isScanning) {
      return (
        <QrReader
          className={classes.scanner}
          delay={DELAY_MS}
          onError={handleError}
          onScan={handleScan}
        />
      );
    }
    return null;
  };
  return (
    <>
      {scannedUserDialog()}
      {scannerOrLoading()}
    </>
  );
};

export default Scanner;
