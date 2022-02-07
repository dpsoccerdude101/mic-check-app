import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    fontSize: '.8rem'
  }
});

type CardTextProps = {
  text: string
};

const CardText = ({ text }: CardTextProps) => {
  const classes = useStyles();
  return <Typography className={classes.root} variant='body2' component='span'>{text}</Typography>;
};

export default CardText;
