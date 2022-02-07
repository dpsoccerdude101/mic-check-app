import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  description: {
    fontSize: '.7rem',
    paddingLeft: 5
  },
  icon: {
    width: '.6rem',
    height: '.6rem'
  }
});

const NewBandBadge = () => {
  const classes = useStyles();
  return (
    <>
      <img className={classes.icon} alt='new-band' src='/icons/new-badge.svg' />
      <Typography className={classes.description} variant='body1'>New</Typography>
    </>
  );
};

export default NewBandBadge;
