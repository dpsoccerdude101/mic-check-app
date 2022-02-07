import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(180deg, rgba(58,62,69,0) 0%, rgba(27,29,33,0.95) 100%)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: '.8',
    top: 0,
    bottom: 0,
    zIndex: -1,
  }
});

type ImageLayerProps = {
  height?: number | string;
  zIndex?: number;
};

const ImageLayer = ({ height = '100%', zIndex = -1 }: ImageLayerProps) => {
  const classes = useStyles();
  return <div className={classes.root} style={{ zIndex, height }} />;
};

export default ImageLayer;
