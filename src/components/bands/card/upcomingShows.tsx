import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';
import CircleDot from 'src/components/circleDot';

const useStyles = makeStyles({
  description: {
    fontSize: '.7rem',
    paddingLeft: 10
  }
});

type UpcomingShowsProps = {
  showsCount: number
};

const UpcomingShows = ({ showsCount }: UpcomingShowsProps) => {
  const classes = useStyles();
  const hasShows = showsCount > 0;
  const postFix = showsCount === 1 ? 'Show' : 'Shows';
  const description = `${hasShows ? showsCount : 'No'} Upcoming ${postFix}`;
  const color = hasShows ? '#7FBA7A' : 'black';
  return (
    <>
      <CircleDot color={color} />
      <Typography className={classes.description} variant='body1'>
        {description}
      </Typography>
    </>
  );
};

UpcomingShows.propTypes = {
  showsCount: PropTypes.number.isRequired
};

export default UpcomingShows;
