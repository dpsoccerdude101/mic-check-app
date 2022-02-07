import { Close } from '@material-ui/icons';
import { MicCheckIcon } from 'src/constants/icons';
import { useSpotlightStore } from 'src/stores';
import { isIOS } from 'react-device-detect';
import { IOS_URL, ANDROID_URL } from 'src/constants/appConstants';
import Link from 'next/link';
import { Button, IconButton, makeStyles, Slide, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '70%',
    width: '90%',
    marginLeft: '5%'
  },
  closeButton: {
    color: 'black',
    marginTop: '-.5rem',
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
  icon: {
    height: 60,
    width: 60,
    borderRadius: 10
  },
  title: {
    paddingRight: 20
  },
  text: {
    fontWeight: 500
  },
  wrapper: {
    background: 'white',
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

const SpotlightBanner = () => {
  const classes = useStyles();
  const { showSignInBanner, setShowSignInBanner } = useSpotlightStore((state) => ({
    showSignInBanner: state.showSignInBanner,
    setShowSignInBanner: state.setShowSignInBanner
  }));

  const closeBanner = () => {
    setShowSignInBanner(false);
  };

  const downloadUrl = isIOS ? IOS_URL : ANDROID_URL;

  const renderBanner = () => (
    <Slide in={showSignInBanner} mountOnEnter unmountOnExit direction='up'>
      <div className={classes.wrapper}>
        <div className={classes.header}>
          <Typography variant='h1' className={classes.title}>Check Out this spotlight!</Typography>
          <IconButton className={classes.closeButton} onClick={() => closeBanner()}><Close fontWeight='500' /></IconButton>
        </div>
        <div className={classes.body}>
          <div>
            <img className={classes.icon} src={MicCheckIcon} alt='miccheck' />
          </div>
          <Typography variant='h2' className={classes.text}>
            Mic Check App
          </Typography>
          <div>
            <Link href={downloadUrl}>
              <Button variant='contained' color='primary'>Download</Button>
            </Link>
          </div>
        </div>
      </div>
    </Slide>
  );

  return (
    renderBanner()
  );
};

export default SpotlightBanner;
