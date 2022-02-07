import { useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import { ChildrenProps } from 'src/types';
import { LOGO_URL } from 'src/constants/appConstants';
import Head from 'next/head';
import TrackService from 'src/services/trackService';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',

    paddingLeft: '20px',
    paddingRight: '20px'
  }
});

type PageWrapperProps = {
  title: string;
};

const PageWrapper = ({ children, title }: PageWrapperProps & ChildrenProps) => {
  const classes = useStyles();
  useEffect(() => {
    TrackService.page(title);
  }, []);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta property='og:site_name' content='Mic Check' />
        <meta property='og:image' content={LOGO_URL} />
      </Head>
      <Box className={classes.root}><Container maxWidth='xl'>{children}</Container></Box>
    </>
  );
};

export default PageWrapper;
