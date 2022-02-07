import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: 'auto'
  }
});

type LoadMoreButtonProps = {
  text: string;
  handleClick: () => Promise<void>;
};

const LoadMoreButton = ({ text, handleClick }: LoadMoreButtonProps) => {
  const classes = useStyles();
  return <Button className={classes.root} onClick={() => handleClick()} variant='contained' color='secondary' fullWidth>{text}</Button>;
};

export default LoadMoreButton;
