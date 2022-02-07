import { ShareOutlined } from '@material-ui/icons';
import { IconButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  icon: {
    color: 'white'
  }
});

type SpotlightIconButtonProps = {
  handleClick: () => Promise<void>;
};

const ShareIcon = ({ handleClick }: SpotlightIconButtonProps) => {
  const classes = useStyles();
  return (
    <IconButton className={classes.icon} onClick={handleClick}>
      <ShareOutlined fontSize='medium' />
    </IconButton>
  );
};

export default ShareIcon;
