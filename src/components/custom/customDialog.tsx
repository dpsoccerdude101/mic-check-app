import { forwardRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, makeStyles } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { CustomDialogProps } from 'src/types';

const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: '30vh',
    minWidth: '30vw',
    [theme.breakpoints.down('md')]: {
      minWidth: '70vw'
    }
  }
}));

const Transition = forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) => <Slide direction='up' ref={ref} {...props} />);

const CustomDialog = (props: CustomDialogProps) => {
  const { closeDialogFunc, children, open, title, text, cancelText, cancelHandler, submitText, submitHandler } = props;
  const classes = useStyles();
  const handleClose = async () => {
    if (cancelHandler) { await cancelHandler(); }
    closeDialogFunc();
  };

  const handleSubmit = async () => {
    await submitHandler();
    closeDialogFunc();
  };

  return (
    <div>
      <Dialog
        classes={{ paper: classes.paper }}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        disableScrollLock
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description' style={{ whiteSpace: 'pre-wrap' }}>
            {text}
          </DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          {cancelText && (
            <Button onClick={handleClose} color='primary' fullWidth>
              {cancelText}
            </Button>
          )}
          <Button onClick={handleSubmit} color='primary' autoFocus fullWidth>
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomDialog;
