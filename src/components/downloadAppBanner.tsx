import MobileStoreButton from 'react-mobile-store-button';
import { Close } from '@material-ui/icons';
import { Colors } from 'src/constants';
import { IOS_URL, ANDROID_URL } from 'src/constants/appConstants';
import { IconButton, makeStyles, Slide, Typography } from '@material-ui/core';
import { isAndroid, isIOS, isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    alignItems: 'center',
    height: '100%'
  },
  closeButton: {
    color: 'white',
    marginTop: '-.3rem',
    position: 'absolute',
    right: 3,
    top: '.9rem'
  },
  header: {
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    display: 'inline-flex',
    paddingTop: '1rem',
    justifyContent: 'center'
  },
  storeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    width: '80%',
    height: '20vh',
    margin: 'auto',
    paddingTop: '3vh'
  },
  title: {
    color: Colors.COLOR_7
  },
  wrapper: {
    background: Colors.PRIMARY,
    bottom: 0,
    height: '30vh',
    width: '100vw',
    position: 'fixed',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    zIndex: 99999
  }
});

const DownloadAppBanner = () => {
  const classes = useStyles();
  const [showBanner, setShowBanner] = useState(false);
  const lsBannerKey = 'displayMobileBanner';

  const getDisplayBannerVal = () => {
    const val = window.localStorage.getItem(lsBannerKey);
    if (val === 'false') {
      return false;
    } if (val === 'true') {
      return true;
    }
    return true;
  };

  const closeBanner = () => {
    window.localStorage.setItem(lsBannerKey, 'false');
    setShowBanner(false);
  };

  useEffect(() => {
    const { userAgent } = navigator;
    const isWebView = userAgent.includes('; wv');
    const dispBannerVal = getDisplayBannerVal();
    if (!isWebView && isMobile && dispBannerVal) {
      setShowBanner(true);
    }
  }, []);

  const renderIosButton = () => (
    <MobileStoreButton
      store='ios'
      url={IOS_URL}
      linkProps={{ title: 'Get MicCheck on IOS' }}
    />
  );

  const renderAndroidButton = () => (
    <a
      href={ANDROID_URL}
    >
      <img
        alt='Get MicCheck on Google Play'
        src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'
      />
    </a>
  );

  const switchButton = () => {
    if (isIOS) { return renderIosButton(); }
    if (isAndroid) { return renderAndroidButton(); }

    return null;
  };

  const renderBanner = () => (
    <Slide in={showBanner} mountOnEnter unmountOnExit direction='up'>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <Typography className={classes.title} variant='h5'>Download the app!</Typography>
          <IconButton className={classes.closeButton} onClick={() => closeBanner()}><Close /></IconButton>
        </div>
        <div className={classes.storeButton}>
          {switchButton()}
        </div>
      </div>
    </Slide>
  );

  return (
    renderBanner()
  );
};

export default DownloadAppBanner;
