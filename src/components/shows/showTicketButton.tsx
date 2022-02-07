import { Button, ButtonProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Colors } from 'src/constants';
import uiRoutes from 'src/constants/uiRoutes';
import QrCodeDialog from '../qrcode/dialog';

/*
ADC 2021-09-18
Make styles is causing css class collisions on the build version.. no idea why
*/
// const useStyles = makeStyles((theme) => ({
//     root: {},
//     test1234: {
//         backgroundColor: Colors.COLOR_7,
//     },
// }));

// const style = {
//     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//     borderRadius: 3,
//     border: 0,
//     color: 'white',
//     height: 48,
//     padding: '0 30px',
//     boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
// };

const ShowTicketButton = ({
  ticketInstanceIds,
  buttonProps,
}: {
  ticketInstanceIds: string[];
  buttonProps?: ButtonProps;
}) => {
  // const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Button
        // className={classes.test1234}
        // classes={{
        //     root: classes.root, // class name, e.g. `root-x`
        // }}
        // style={style}
        variant='contained'
        onClick={(e) => {
          e.stopPropagation();
          setDialogOpen(true);
        }}
        {...buttonProps}
      >
        View My Ticket
      </Button>
      <QrCodeDialog
        contentIds={ticketInstanceIds}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default ShowTicketButton;
