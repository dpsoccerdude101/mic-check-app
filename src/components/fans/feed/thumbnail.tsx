/* eslint-disable jsx-a11y/media-has-caption */
import { IconButton, CircularProgress, makeStyles } from '@material-ui/core';
import { useState } from 'react';
import { PlayCircleOutline } from '@material-ui/icons';
import { LOGO_URL } from 'src/constants/appConstants';

const useStyles = makeStyles({
  button: {
    position: 'absolute',
    left: '35%',
    top: '40% '
  },
  iconWrapper: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    bottom: 0
  },
  whiteColor: {
    color: '#FFF'
  },
  video: {
    height: '100%',
    objectFit: 'cover',
    width: '100%',
    opacity: '.8'
  }
});

type ThumbnailProps = {
  id: string;
  handleClick?: (e) => void;
  videoSrc: string;
};

const Thumbnail = ({ id, handleClick, videoSrc }: ThumbnailProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  const renderLoading = () => {
    if (loading) return <CircularProgress className={classes.whiteColor} />;
    return null;
  };

  const play = (e) => {
    if (!loading) {
      handleClick(e);
    }
  };

  const renderPlay = () => {
    if (loading) return null;
    return (
      <IconButton aria-label='play' onClick={play}>
        <PlayCircleOutline className={classes.whiteColor} fontSize='large' />
      </IconButton>
    );
  };

  return (
    <>
      <video
        id={id}
        src={`${videoSrc}#t=0.1`}
        className={classes.video}
        preload='metadata'
        poster={LOGO_URL}
        onCanPlay={() => setLoading(false)}
        onClick={play}
      />
      <div className={classes.iconWrapper}>
        {renderLoading()}
        {renderPlay()}
      </div>
    </>
  );
};

export default Thumbnail;
