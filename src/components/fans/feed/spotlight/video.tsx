/* eslint-disable jsx-a11y/media-has-caption */
import { createRef, RefObject, useState } from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { LOGO_URL } from 'src/constants/appConstants';

const useStyles = makeStyles({
  loader: {
    color: 'white',
    position: 'absolute',
    top: 'calc(50vh - 20px)',
    left: 'calc(50vw - 20px)'
  },
  video: {
    height: '100%',
    width: '100%',
    objectFit: 'cover'
  }
});

type SpotlightVideoProps = {
  source: string,
  loadedCallback: () => void;
};

const SpotlightVideo = ({ source, loadedCallback }: SpotlightVideoProps) => {
  const videoRef = createRef() as RefObject<HTMLVideoElement>;
  const [loading, setLoading] = useState(true);

  const classes = useStyles();
  const handleClick = () => {
    const video: HTMLVideoElement = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const renderLoading = () => {
    if (!loading) return null;

    return <CircularProgress className={classes.loader} />;
  };

  return (
    <>
      <video
        onClick={handleClick}
        className={classes.video}
        onCanPlay={() => {
          loadedCallback();
          setLoading(false);
        }}
        poster={LOGO_URL}
        onLoadStart={() => setLoading(true)}
        src={source}
        autoPlay
        loop
        ref={videoRef}
      />

      {renderLoading()}

    </>
  );
};

export default SpotlightVideo;
