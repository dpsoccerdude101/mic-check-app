import { ReactNode } from 'react';
import {
    Grid,
    Typography,
    makeStyles,
    Box,
    IconButton,
} from '@material-ui/core';
import { useAuth, useLayout } from 'src/hooks';
import CustomPaper from 'src/components/custom/customPaper';
import PropTypes from 'prop-types';
import { Images } from 'src/constants';
import Image from 'next/image';
import { Close } from '@material-ui/icons';
import { useRouter } from 'next/router';

const { BackgroundImage, HorizontalLogo } = Images;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        '&::before': {
            content: "''",
            flex: 1,
        },
        '&::after': {
            content: "''",
            flex: 1,
        },
    },
    bg: {
        zIndex: 0,
    },
    gridRoot: {
        [theme.breakpoints.only('sm')]: {
            marginRight: '15%',
            marginLeft: '15%',
        },
        [theme.breakpoints.up('md')]: {
            paddingRight: '5%',
            paddingLeft: '5%',
        },
        [theme.breakpoints.only('lg')]: {
            paddingRight: '10%',
            paddingLeft: '10%',
        },
        [theme.breakpoints.only('xl')]: {
            marginRight: 0,
            marginLeft: 0,
        },
        zIndex: 2,
    },
    imageWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '15%',
        [theme.breakpoints.down('md')]: {
            marginBottom: 10,
        },
        [theme.breakpoints.only('xs')]: {
            display: 'none',
        },
    },
    paper: {
        [theme.breakpoints.down('md')]: {
            paddingLeft: 25,
            paddingRight: 25,
        },
        paddingTop: 30,
        overflowY: 'auto',
        maxHeight: '100vh',
    },
    title: {
        fontSize: 32,
    },
}));

type AuthLayoutProps = {
    children: ReactNode;
    title: string;
    subtitle?: string;
};

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    useLayout('simple');
    const classes = useStyles();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { returnUrl } = router.query;

    const onClose = () => {
        console.log('returnUrl', returnUrl);
        router.push(returnUrl.toString());
    };

    return isAuthenticated ? null : (
        <div className={classes.root}>
            <Image
                priority
                alt="background"
                src={BackgroundImage}
                layout="fill"
                className={classes.bg}
            />
            <Grid container className={classes.gridRoot}>
                <Grid
                    item
                    xl={2}
                    sx={{ display: { xs: 'none', xl: 'block' } }}
                />
                <Grid item md={6} xl={4} className={classes.imageWrapper}>
                    <Image
                        alt="horizontal logo"
                        src={HorizontalLogo}
                        width={320}
                        height={80}
                    />
                </Grid>
                <Grid
                    item
                    xl={1}
                    sx={{ display: { xs: 'none', xl: 'block' } }}
                />
                <Grid item xs={12} md={6} xl={3}>
                    <CustomPaper className={classes.paper}>
                        <Grid rowGap={1} container spacing={3}>
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Box>
                                    <Typography
                                        className={classes.title}
                                        variant="h1"
                                    >
                                        {title}
                                    </Typography>
                                    {subtitle && (
                                        <Box pt={2}>
                                            <Typography
                                                variant="body1"
                                                gutterBottom
                                            >
                                                {subtitle}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                                {returnUrl && (
                                    <IconButton
                                        edge="end"
                                        color="inherit"
                                        onClick={onClose}
                                        aria-label="close"
                                    >
                                        <Close />
                                    </IconButton>
                                )}
                            </Grid>
                            {children}
                        </Grid>
                    </CustomPaper>
                </Grid>
            </Grid>
        </div>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.any.isRequired,
    title: PropTypes.any.isRequired,
};

export default AuthLayout;
