import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline, Zoom } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LayoutsWrapper from 'src/components/layouts/layoutsWrapper';
import DownloadAppBanner from 'src/components/downloadAppBanner';
import mainTheme from '../theme';
import { AuthProvider, DialogProvider, LoadProvider } from '../contexts';
import RouteGuard from 'src/components/routeGuard';
import 'nprogress/nprogress.css';
import '../styles/global.css';
import { LayoutProvider } from 'src/contexts/layoutContext';
import ShowBanner from 'src/components/showBanner';

function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles?.parentElement?.removeChild(jssStyles);
        }
    }, []);
    return (
        <>
            <HelmetProvider>
                <Head>
                    <title>MicCheck</title>
                    <meta
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width"
                    />
                </Head>
                <ThemeProvider theme={mainTheme}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <CssBaseline />
                        <SnackbarProvider
                            preventDuplicate
                            autoHideDuration={3000}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            TransitionComponent={Zoom}
                            maxSnack={3}
                        >
                            <AuthProvider>
                                <DialogProvider>
                                    <LoadProvider>
                                        <RouteGuard pageProps={pageProps}>
                                            <LayoutProvider>
                                                <LayoutsWrapper>
                                                    <Component {...pageProps} />
                                                    <DownloadAppBanner />
                                                </LayoutsWrapper>
                                            </LayoutProvider>
                                        </RouteGuard>
                                    </LoadProvider>
                                </DialogProvider>
                            </AuthProvider>
                        </SnackbarProvider>
                    </LocalizationProvider>
                </ThemeProvider>
            </HelmetProvider>
        </>
    );
}
export default App;
