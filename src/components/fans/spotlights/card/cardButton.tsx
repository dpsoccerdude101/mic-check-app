import { Button, makeStyles } from '@material-ui/core';
import { Colors } from 'src/constants';
import CardText from './cardText';

const useStyles = makeStyles({
  root: {
    background: Colors.QUATERNARY,
    borderRadius: 10,
    padding: '10px 20px'
  }
});

type CardButtonProps = {
  disabled?: boolean;
  handleClick: () => void;
  startIcon: JSX.Element;
  text: string;
};

const CardButton = ({ disabled = false, handleClick, startIcon, text }: CardButtonProps) => {
  const classes = useStyles();
  return (
    <Button disabled={disabled} className={classes.root} startIcon={startIcon} onClick={handleClick}><CardText text={text} /></Button>
  );
};

export default CardButton;
