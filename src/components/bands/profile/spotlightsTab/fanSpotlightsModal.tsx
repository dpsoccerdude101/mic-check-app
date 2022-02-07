import { forwardRef } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Slide, useMediaQuery, makeStyles } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import FanSpotlightsForm from './fanSpotlightsForm';

const useStyles = makeStyles({
  title: {
    textAlign: 'right',
    paddingBottom: 0
  }
});

type FanSpotlightsModalProps = {
  bandId: string;
  bandName: string;
  handleClose: () => void;
  open: boolean;
};

const Transition = forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) => <Slide direction='up' ref={ref} {...props} />);

const FanSpotlightsModal = ({ bandId, bandName, handleClose, open }: FanSpotlightsModalProps) => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      open={open}
      onClose={handleClose}
      aria-labelledby='responsive-dialog-title'
    >
      <DialogTitle className={classes.title}>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FanSpotlightsForm bandId={bandId} bandName={bandName} handleAdd={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default FanSpotlightsModal;
