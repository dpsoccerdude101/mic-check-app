import { ReactNode } from 'react';
import {
  Grid,
  Typography,
  makeStyles,
  Box,
  PaperProps,
  useMediaQuery,
  useTheme,
  Paper,
} from '@material-ui/core';
import { useAuth } from 'src/hooks';
import CustomPaper from 'src/components/custom/customPaper';
import PropTypes from 'prop-types';
import { Images } from 'src/constants';
import Image, { ImageProps } from 'next/image';

const { BackgroundImage, HorizontalLogo } = Images;

const useStyles = makeStyles((theme) => ({
  header: {},
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    '&::before': {
      content: "''",
      flex: 1,
    },
    '&::after': {
      content: "''",
      flex: 1,
    },
  },
  bg: {
    zIndex: -1,
  },
  gridRoot: {
    [theme.breakpoints.only('sm')]: {
      marginRight: '15%',
      marginLeft: '15%',
    },
    [theme.breakpoints.up('md')]: {
      paddingRight: '5%',
      paddingLeft: '5%',
    },
    [theme.breakpoints.only('lg')]: {
      paddingRight: '10%',
      paddingLeft: '10%',
    },
    [theme.breakpoints.only('xl')]: {
      marginRight: 0,
      marginLeft: 0,
    },
    zIndex: 2,
  },
  imageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15%',
    [theme.breakpoints.down('md')]: {
      marginBottom: 10,
    },
    [theme.breakpoints.only('xs')]: {
      display: 'none',
    },
  },
  paper: {
    // [theme.breakpoints.down('md')]: {
    //     paddingLeft: 25,
    //     paddingRight: 25,
    // },
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  title: {
    fontSize: 32,
  },
}));

type SmallContentBodyLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  paperProps?: PaperProps;
};

const SmallContentBodyLayout = ({
  children,
  title,
  subtitle,
  paperProps,
}: SmallContentBodyLayoutProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      <div className={classes.body}>
        <Grid container className={classes.gridRoot}>
          <Grid
            item
            xl={2}
            sx={{ display: { xs: 'none', xl: 'block' } }}
          />
          <Grid item md={6} xl={4} className={classes.imageWrapper}>
            <Image
              alt='horizontal logo'
              src={HorizontalLogo}
              width={320}
              height={80}
            />
          </Grid>
          <Grid
            item
            xl={1}
            sx={{ display: { xs: 'none', xl: 'block' } }}
          />
          <Grid item xs={12} md={6} xl={3}>
            <Paper
              className={classes.paper}
              elevation={mdDown ? 0 : 1}
              square
              {...paperProps}
            >
              <Grid container spacing={0}>
                <Grid item xs={12} pl={2}>
                  {title && (
                    <Typography
                      className={classes.title}
                      variant='h1'
                    >
                      {title}
                    </Typography>
                  )}
                  {subtitle && (
                    <Box pt={2}>
                      <Typography
                        variant='body1'
                        gutterBottom
                      >
                        {subtitle}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  {children}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

SmallContentBodyLayout.propTypes = {
  children: PropTypes.any.isRequired,
};

export default SmallContentBodyLayout;
