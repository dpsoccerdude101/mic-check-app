import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNavigationStore, useSpotlightStore } from 'src/stores';
import { IconButton, makeStyles } from '@material-ui/core';
import { KeyboardBackspace } from '@material-ui/icons';
import { useAuth } from 'src/hooks';
import { UiRoutes } from 'src/constants';
import { MicCheckIcon } from 'src/constants/icons';
import { LOGO_URL } from 'src/constants/appConstants';
import { CustomLoaderFullPage } from 'src/components';
import { useSwipeable } from 'react-swipeable';
import { useSnackbar } from 'notistack';
import Head from 'next/head';
import SpotlightBanner from './spotlightBanner';
import Actions from './actions';
import Overlay from './overlay';
import Video from './video';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    position: 'relative',
    zIndex: 9999
  },
  backArrow: {
    position: 'absolute',
    color: 'white',
    top: 0,
    left: 5
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: '10%',
    position: 'absolute',
    top: 5,
    right: 5
  }
});

const SelectedSpotlightPage = () => {
  const [loading, setLoading] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();

  const { id, setShowSignInBanner, spotlights, setSelectedSpotlight, title, videoSrc } = useSpotlightStore((state) => ({
    id: state.id,
    videoSrc: state.videoSrc,
    showSignInBanner: state.showSignInBanner,
    setShowSignInBanner: state.setShowSignInBanner,
    setSelectedSpotlight: state.setSelectedSpotlight,
    spotlights: state.spotlights,
    title: state.title
  }));

  const { hideNavBar } = useNavigationStore((state) => ({ hideNavBar: state.hideNavBar }));

  useEffect(() => {
    hideNavBar();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [id]);

  const showToast = (message: string) => {
    enqueueSnackbar(message, { variant: 'info', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
  };

  const selectNextSpotlight = () => {
    const index = spotlights.findIndex((el) => el.id === id);
    const { length } = spotlights;
    const isLast = index === length - 1;
    if (isLast) {
      showToast('This is the last spotlight');
      return;
    }

    setLoading(true);
    const nextSpotlight = spotlights[index + 1];
    setSelectedSpotlight(nextSpotlight);
  };

  const selectPreviousSpotlight = () => {
    const index = spotlights.findIndex((el) => el.id === id);
    if (index === 0) {
      showToast('This is the first spotlight');
      return;
    }
    setLoading(true);
    const previous = spotlights[index - 1];
    setSelectedSpotlight(previous);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => selectNextSpotlight(),
    onSwipedRight: () => selectPreviousSpotlight()
  });

  const handleBackArrowClick = () => {
    if (isAuthenticated) {
      router.push(UiRoutes.Fans.Feed.toString(), null, {
        shallow: false
      });
    } else {
      setShowSignInBanner(true);
    }
  };

  const renderBackArrow = () => (
    <IconButton className={classes.backArrow} onClick={handleBackArrowClick}>
      <KeyboardBackspace fontSize='medium' />
    </IconButton>
  );

  const renderLogoIfGuest = () => {
    if (isAuthenticated) return null;
    return (
      <img className={classes.logo} src={MicCheckIcon} alt='miccheck' />
    );
  };

  const render = () => {
    if (!id) return null;
    if (loading) return <CustomLoaderFullPage />;

    return (
      <>
        <div className={classes.root} {...(isAuthenticated ? handlers : null)}>
          <Video source={videoSrc} loadedCallback={() => setOverlayVisible(true)} />
          {isOverlayVisible && <Overlay />}
          {renderLogoIfGuest()}
          {renderBackArrow()}
          <Actions />
        </div>
        <SpotlightBanner />
      </>
    );
  };

  const clientURL = window.location.origin;
  const spotlightUrl = `${clientURL}${UiRoutes.Fans.Feed.Spotlight}/${id}`;

  let titleText = 'Mic Check Spotlight';
  if (title) { titleText += ` - ${title}`; }

  return (
    <>
      <Head>
        <title>{titleText}</title>
        <meta property='og:title' content={titleText} />
        <meta property='og:site_name' content='Mic Check' />
        <meta property='og:image' content={LOGO_URL} />
        <meta property='og:url' content={spotlightUrl} />
        <meta property='og:video' content={videoSrc} />
        <meta property='og:description' content={`Check out this awesome spotlight from ${title} on Mic Check App!`} />
        <meta property='og:type' content='video.other' />
      </Head>
      {render()}
    </>

  );
};

export default SelectedSpotlightPage;
