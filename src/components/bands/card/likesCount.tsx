import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import { Groups } from '@material-ui/icons';

const useStyles = makeStyles({
  description: {
    fontSize: '.75rem',
    paddingLeft: 10,
    color: '#696A72'
  }
});

type LikesCountProps = {
  likesCount: number
};

const LikesCount = ({ likesCount }: LikesCountProps) => {
  const classes = useStyles();
  const hasfans = likesCount > 0;
  const postFix = likesCount === 1 ? 'Fan' : 'Fans';
  const description = `${hasfans ? likesCount : 'No'} ${postFix}`;
  return (
    <>
      <Groups fontSize='small' />
      <Typography className={classes.description} variant='body1'>
        {description}
      </Typography>
    </>
  );
};

LikesCount.propTypes = {
  likesCount: PropTypes.number.isRequired
};

export default LikesCount;
