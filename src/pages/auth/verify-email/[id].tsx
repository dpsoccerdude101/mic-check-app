import {
    Alert,
    Button,
    CircularProgress,
    Grid,
    Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import AuthLayout from 'src/components/layouts/authLayout';
import { BandMembersSerivce, FansSerivce } from 'src/services';

const useStyles = makeStyles({
    button: {
        height: 55,
    },
    grayText: {
        color: '#A3A3A3',
        fontSize: 16,
        lineHeight: '22px',
    },
    subtitle: {
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '22px',
    },
});

export default function VerifyEmail() {
    const classes = useStyles();
    const router = useRouter();
    const { id, type } = router.query;
    const [isBusy, setIsBusy] = useState(false);
    const [success, setSuccess] = useState(null);
    const [message, setMessage] = useState(null);

    const handleResendClick = (e) => {
        (async () => {
            setMessage(null);
            setIsBusy(true);
            let response =
                type == 'fan'
                    ? await FansSerivce.resendConfirmationEmail(id.toString())
                    : await BandMembersSerivce.resendConfirmationEmail(
                          id.toString()
                      );
            setSuccess(response.success);
            setMessage(response.message);
            setIsBusy(false);
        })();
    };

    return (
        <AuthLayout title="Verify your email">
            <Grid item xs={12}>
                <Typography className={classes.subtitle} variant="h2">
                    Check your email and click the link to finish creating your
                    account.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography className={classes.grayText} variant="h3">
                    Didn&apos;t receive the email? Check your spam folder or
                    click the Resend button bellow.
                </Typography>
            </Grid>
            {message && (
                <Grid item xs={12}>
                    <Alert severity={success ? 'success' : 'error'}>
                        {message}
                    </Alert>
                </Grid>
            )}
            <Grid item xs={12}>
                <Button
                    onClick={handleResendClick}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="button"
                    fullWidth
                    disabled={isBusy}
                >
                    {isBusy && <CircularProgress />}
                    <Typography ml={isBusy ? 2 : 0} color="white">
                        Resend Confirmation Email
                    </Typography>
                </Button>
            </Grid>
        </AuthLayout>
    );
}
