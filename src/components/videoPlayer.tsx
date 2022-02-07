import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '100%',
    borderRadius: 5,
    [theme.breakpoints.up('md')]: {
      height: '23vh'
    }
  }
}));

type VideoPlayperProps = {
  className?: string;
  handleFirstPlay?: () => void;
  videoSrc: string;
};

const VideoPlayer = ({ className, handleFirstPlay, videoSrc }: VideoPlayperProps) => {
  const classes = useStyles();
  const [startedVideo, setStartedVideo] = useState(false);

  const handleOnPlay = () => {
    if (handleFirstPlay && !startedVideo) {
      handleFirstPlay();
      setStartedVideo(true);
    }
  };
  return (
    <video onPlay={handleOnPlay} src={`${videoSrc}#t=0.1`} className={clsx(classes.video, className)} preload='metadata' controls>
      <track kind='captions' />
    </video>
  );
};

export default VideoPlayer;
