import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import { HorizontalLogo } from 'src/constants/images';

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    left: 0,
    padding: theme.spacing(3),
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 2000
  },
  logo: {
    width: 256,
    height: 63,
    maxWidth: '100%'
  }
}));

const CustomLoaderFullPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box
        display='flex'
        justifyContent='center'
        mb={2}
      >
        <img src={HorizontalLogo} alt='Splash screen' className={classes.logo} />
      </Box>
      <CircularProgress />
    </div>
  );
};

export default CustomLoaderFullPage;
