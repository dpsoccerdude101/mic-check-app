import MobileStoreButton from 'react-mobile-store-button';
import { Close } from '@material-ui/icons';
import { Colors, UiRoutes } from 'src/constants';
import { IOS_URL, ANDROID_URL } from 'src/constants/appConstants';
import {
    IconButton,
    makeStyles,
    Slide,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    ListItem,
    ListItemText,
    DialogContent,
    Drawer,
    List,
} from '@material-ui/core';
import { isAndroid, isIOS, isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { useDialog } from 'src/hooks';
import { Band, SetDialogProps, ShowBandDto } from 'src/types';
import styled from '@material-ui/styles/styled';
import Link from 'next/link';
import ShowsService from 'src/services/showsService';
import { useRouter } from 'next/router';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles({
    body: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
    },
    closeButton: {
        color: 'white',
        marginTop: '-.3rem',
        position: 'absolute',
        right: 3,
        top: '.9rem',
    },
    header: {
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        display: 'inline-flex',
        paddingTop: '1rem',
        justifyContent: 'center',
    },
    imgWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        //width: '80%',
        //height: '20vh',
        height: '50%',
        margin: 'auto',
        //paddingTop: '3vh',
    },
    title: {
        color: Colors.COLOR_7,
    },
    wrapper: {
        background: Colors.PRIMARY,
        bottom: 0,
        height: '90vh',
        width: '100vw',
        position: 'fixed',
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: 99999,
    },
    img: {
        //height: '100%',
        width: '80vw',
        margin: 'auto',
    },
});

const bands = ['band 1', 'band 2', 'band 3'];

const ShowBanner = () => {
    const { isAuthenticated } = useAuth();
    const classes = useStyles();
    const router = useRouter();
    const [showBanner, setShowBanner] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showBands, setShowBands] = useState<ShowBandDto[]>([]);
    const lsBannerKey = 'displayFeaturedShowBanner1';

    const getDisplayBannerVal = () => {
        const val = window.localStorage.getItem(lsBannerKey);
        if (val === 'false') {
            return false;
        }
        if (val === 'true') {
            return true;
        }
        return true;
    };

    const closeBanner = () => {
        window.localStorage.setItem(lsBannerKey, 'false');
        //setShowBanner(false);
        setShowDrawer(false);
    };

    useEffect(() => {
        // const { userAgent } = navigator;
        // const isWebView = userAgent.includes('; wv');
        const dispBannerVal = getDisplayBannerVal();
        //&& (isWebView || isMobile)
        if (isAuthenticated && dispBannerVal) {
            // setShowBanner(true);
            (async () => {
                const response = await ShowsService.getFeaturedShow();
                console.log('Featured show?', response.message, response.data);
                if (response.success && response.data) {
                    setShowBands(response.data.bands);
                    setShowDrawer(true);
                }
            })();
        }
    }, []);

    const handleSelect = (band: ShowBandDto) => {
        var route = UiRoutes.Bands.Profile(band.bandId);
        router.push(route);
    };

    const renderBanner = () => (
        <>
            <Drawer anchor="bottom" open={showDrawer}>
                <BandList
                    showBands={showBands}
                    onSelect={handleSelect}
                    onClose={closeBanner}
                ></BandList>
            </Drawer>
        </>
    );

    return renderBanner();
};

export default ShowBanner;

interface BandListProps {
    showBands: ShowBandDto[];
    onSelect: (showBand: ShowBandDto) => void;
    onClose: () => void;
}

function BandList(props: BandListProps) {
    const classes = useStyles();
    return (
        <Box
            sx={{ width: 'auto' }}
            role="presentation"
            //onClick={props.onSelect(null)}
            //onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography className={classes.title} variant="h5" pl={2}>
                    Featured Show
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={() => props.onClose()}
                    sx={{
                        // position: 'absolute',
                        // right: 8,
                        // top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </Box>
            <Box
                display="flex"
                flexDirection="column" //my={2}
            >
                <Box>
                    <img
                        className={classes.img}
                        alt="Featured Show"
                        src="/images/featured-show.jpg"
                    />
                </Box>
            </Box>
            <List>
                {props.showBands.map((band, index) => (
                    <ListItem
                        button
                        key={index}
                        onClick={() => props.onSelect(band)}
                    >
                        {/* <Link href="/"> */}
                        <ListItemText primary={band.band.name} />
                        {/* </Link> */}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
