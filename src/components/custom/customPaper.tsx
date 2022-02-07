import { Paper, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    padding: 50
  }
});

const CustomPaper = ({ children, className = ''}) => {
  const classes = useStyles();
  return <Paper className={clsx(classes.root, className)} square>{children}</Paper>;
};

CustomPaper.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  radius: PropTypes.number
};

export default CustomPaper;
