import { Divider, makeStyles } from '@material-ui/core';

import { Colors } from 'src/constants';

const useStyles = makeStyles((theme) => ({
  divider: {
    width: '100vw',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    color: Colors.COLOR_5
  }
}));
const GrayDivider = () => {
  const classes = useStyles();
  return (<Divider className={classes.divider} />);
};
export default GrayDivider;
