import { Box, Dialog, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import React, { ReactNode } from 'react';

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) => <Slide direction='up' ref={ref} {...props} />);

type TicketOrderDialogProps = {
  header?: ReactNode;
  body: ReactNode;
};

const TicketOrderDialog = ({ header, body }: TicketOrderDialogProps) => (
  <Dialog
    open
    fullScreen
    TransitionComponent={Transition}
    keepMounted
  >

    <Box
      display='flex'
      width='100%'
      justifyContent='space-between'
      flexDirection='column'
    >
      {header}
    </Box>
    {body}
  </Dialog>
);

export default TicketOrderDialog;
