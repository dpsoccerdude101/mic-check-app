import { Typography, makeStyles } from '@material-ui/core';
import { Favorite } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: 'white',
    width: theme.spacing(3),
    height: theme.spacing(4)
  }
}));

type LikesCountProps = {
  count: number;
};

const LikesCount = ({ count }: LikesCountProps) => {
  if (count === 0) { return null; }
  const classes = useStyles();
  const text = count === 1 ? 'Like' : 'Likes';

  return (
    <>
      <Favorite className={classes.icon} fontSize='small' />
      <Typography
        sx={{ ml: 1 }}
        variant='body2'
        component='span'
        color='white'
        fontSize='small'
      >
        {count}
        {' '}
        {text}
      </Typography>
    </>
  );
};

export default LikesCount;
