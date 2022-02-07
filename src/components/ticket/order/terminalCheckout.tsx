import React from 'react';
import { Box, Typography, Dialog, Slide, Button, Grid } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { useTicketInstanceStore } from 'src/stores';
import { ProcessDoorTicketsIcon, SuccessIcon, ErrorIcon } from 'src/constants/icons';

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) => <Slide direction='up' ref={ref} {...props} />);

const TerminalCheckout = () => {
        
    const {
        checkOutOpen,
        checkOutSuccess,
        setCheckOutOpen,
    } = useTicketInstanceStore((state) => ({
        checkOutOpen: state.checkOutOpen,
        checkOutSuccess: state.checkOutSuccess,
        setCheckOutOpen: state.setCheckOutOpen,
    }));

    const handleClick = (event) => {
        event.stopPropagation();
        setCheckOutOpen(false);
    };

    let message = '';
    let disableClose = true;
    if (checkOutSuccess == null) {
        message = 'Checkout sent';
        disableClose = true;
    }
    else if (checkOutSuccess == true) {
        message = 'Success';
        disableClose = false;
    }
    else if (checkOutSuccess == false) {
        message = 'Canceled';
        disableClose = false;
    }

    function ShowImage(props) {
        const checkOutSuccess = props.checkOutSuccess;
        if (checkOutSuccess == null) {
            return <img alt='Checkout sent' src={ProcessDoorTicketsIcon} />;
        }
        else if (checkOutSuccess == true) {
            return <img alt='Success' src={SuccessIcon} />;
        }
        else if (checkOutSuccess == false) {
            return <img alt='Canceled' src={ErrorIcon} />;
        }
    }

    return (
        <Dialog
            open={checkOutOpen}
            fullScreen
            TransitionComponent={Transition}
            keepMounted
        >
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                px={2}
            >
                <Grid item xs={12} sm={8} md={4} lg={4} 
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    padding={3}
                    marginBottom={3}
                >

                    <Box
                        display='flex'
                        height='230px'
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                        flexDirection='column'
                    >
                        <ShowImage checkOutSuccess={checkOutSuccess} />
                        <Typography variant='h2'>{message}</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={(e) => handleClick(e)}
                            disabled={disableClose}
                        >
                            Close
                        </Button>      
                    </Box>

                </Grid>
            </Grid>

        </Dialog>
    )
};

export default TerminalCheckout;
