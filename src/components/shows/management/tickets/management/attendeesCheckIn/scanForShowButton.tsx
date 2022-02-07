import { Button, makeStyles } from '@material-ui/core';
import { useTicketScanStore } from 'src/stores';

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}));

const ScanForShowButton = () => {
  const classes = useStyles();
  const {
    isScanning,
    toggleScanner
  } = useTicketScanStore(
    (state) => ({
      isScanning: state.isScanning,
      toggleScanner: state.toggleScanner
    })
  );

  const onClick = () => {
    toggleScanner();
  };

  return (
    <Button
      className={classes.root}
      variant='contained'
      color='primary'
      onClick={onClick}
    >
      {isScanning ? 'Stop scanning' : 'Start scanning'}
    </Button>
  );
};

export default ScanForShowButton;
