import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  overlay: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    background: 'black',
    opacity: '.3',
    pointerEvents: 'none'
  },

});

const Overlay = () => {
  const classes = useStyles();
  return (
    <div className={classes.overlay} />
  );
};

export default Overlay;
