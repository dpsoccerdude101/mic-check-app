import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

type CustomLoaderProps =
  {
    paddingTop?: string;
  };

const CustomLoader = ({ paddingTop = '25%' }: CustomLoaderProps) => {
  const classes = useStyles();

  return <div className={classes.loader} style={{ paddingTop }}><CircularProgress /></div>;
};

export default CustomLoader;
