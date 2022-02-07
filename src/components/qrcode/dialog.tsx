import classes from '*.module.css';
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    Slide,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/close';
import { makeStyles } from '@material-ui/styles';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { ApiRoutes, Colors } from 'src/constants';
import { TicketService } from 'src/services';
import ticketOrderConfirmationService from 'src/services/ticketOrderConfirmationService';
import TicketOrderConfirmation from 'src/types/tickets/ticketOrderConfirmationInfo';
import { Formatter } from 'src/utils';
import QrCode from './qrcode';
import { v4 as uuidv4 } from 'uuid';

const Transition = React.forwardRef(
    (
        props: TransitionProps & { children?: React.ReactElement },
        ref: React.Ref<unknown>
    ) => <Slide direction="up" ref={ref} {...props} />
);

type QrCodeDialogProps = {
    header?: ReactNode;
    contentIds: string[];
    open: boolean;
    onClose: React.MouseEventHandler<HTMLButtonElement>;
};

const QrCodeDialog = ({
    header,
    contentIds,
    onClose,
    open = true,
}: QrCodeDialogProps) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [orderConfirmation, setOrderConfirmation] =
        useState<TicketOrderConfirmation>();

    useEffect(() => {
        (async () => {
            const response = await ticketOrderConfirmationService.get(
                contentIds[0]
            );
            if (response.success) {
                setOrderConfirmation(response.data);
            }
        })();
    }, [contentIds]);

    return (
        <Dialog
            open={open}
            fullScreen={fullScreen}
            scroll={'body'}
            TransitionComponent={Transition}
            keepMounted
        >
            <DialogContent>
                <Box
                    display="flex"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <div>{header}</div>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                {orderConfirmation && (
                    <Box>
                        <Typography variant="h3">
                            {orderConfirmation.showName}
                        </Typography>
                        <Typography>
                            {Formatter.formatDateAndTime(
                                orderConfirmation.showDate
                            )}
                        </Typography>
                        <Typography>{orderConfirmation.venueName}</Typography>
                    </Box>
                )}
                <Box
                    alignItems="center"
                    border="4px solid"
                    borderColor={theme.palette.grey['A100']}
                    borderRadius=".2em"
                    alignContent="center"
                    px={theme.spacing(3)}
                    py={theme.spacing(10)}
                    my={theme.spacing(2)}
                >
                {contentIds.map((id) => {
                    return <QrCode
                                key={uuidv4()}
                                contentId={id}
                                apiGenerationRoute={
                                    ApiRoutes.TicketInstances.GenerateQRCode
                                }
                            />
                })}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default QrCodeDialog;
