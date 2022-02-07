import { Grid, makeStyles } from '@material-ui/core';
import { ChildrenProps } from 'src/types';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 10,
    [theme.breakpoints.only('xs')]: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 0
    },
    [theme.breakpoints.only('sm')]: {
      paddingLeft: 30,
      paddingRight: 30,
      paddingTop: 10
    }
  }
}));

const BandProfileContainer = ({ children }: ChildrenProps) => {
  const classes = useStyles();
  return (
    <Grid className={classes.root} container spacing={2}>
      {children}
    </Grid>
  );
};

export default BandProfileContainer;
