import { forwardRef } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { CustomDialogProps } from 'src/types';

const Transition = forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) => <Slide direction='up' ref={ref} {...props} />);

const AddBandDialog = (props: CustomDialogProps) => {
  const { children, open, title, text, cancelText, cancelHandler, submitText, submitHandler } = props;

  const handleClose = async () => {
    if (cancelHandler) { await cancelHandler(); }
  };

  const handleSubmit = async () => {
    await submitHandler();
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby='alert-dialog-slide-title'
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle id='alert-dialog-slide-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            {text}
          </DialogContentText>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined'>
            {cancelText}
          </Button>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            {submitText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddBandDialog;
