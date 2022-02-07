import {
    Box,
    Dialog,
    DialogContent,
    makeStyles,
    Slide,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import React, { ReactNode } from 'react';
import { Colors } from 'src/constants';
import Body from './body';

const Transition = React.forwardRef(
    (
        props: TransitionProps & { children?: React.ReactElement },
        ref: React.Ref<unknown>
    ) => <Slide direction="up" ref={ref} {...props} />
);

type BillingInfoDialogProps = {
    header?: ReactNode;
};

const useStyles = makeStyles((theme) => ({
    root: {},
    container: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '400px',
        },
    },
    content: {
        padding: 0,
    },
    backdrop: {
        backgroundColor: Colors.DARK_BACKDROP,
    },
}));

const BillingInfoDialog = ({ header }: BillingInfoDialogProps) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <Dialog
            className={classes.root}
            open
            fullScreen={useMediaQuery(theme.breakpoints.down('sm'))}
            scroll={'body'}
            TransitionComponent={Transition}
            keepMounted
            BackdropProps={{ className: classes.backdrop }}
        >
            <Box className={classes.container}>
                {header}
                <DialogContent className={classes.content}>
                    <Body />
                </DialogContent>
            </Box>
        </Dialog>
    );
};

export default BillingInfoDialog;
