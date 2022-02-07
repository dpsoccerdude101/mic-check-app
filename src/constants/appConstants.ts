import Layout from './layouts';

export const layoutContainerId: string = 'layout-container';
export const navPaddingTop: number = 120;
export const navbarHeight: number = 64;
export const sidebarWidth: number = 280;
export const defaultPageLayout: Layout = 'standard';

/* URLS */
export const IOS_URL =
    'https://apps.apple.com/us/app/the-miccheck/id1571307669';
export const ANDROID_URL =
    'https://play.google.com/store/apps/details?id=com.bluprints.MicCheck';
export const LOGO_URL = 'https://api.themiccheck.com/storage/icon.png';
export const YOUTUBE_URL = `https://youtu.be`;
/* URLS */

/* COOKIES */
const tokenLabel = '*.dE4ddTSe8.Ysa-98-WW';
const bandIdLabel = 'N-tqhg26Gw8***N37F';
const fanIdLabel = 'Rz3YHsD!c!.a*rEk';
const ticketScanningShowIdLabel = 'ticketScanningShowIdLabel'; // TODO: fix value
const redirectUrlLabel = 'Mlpuh.*0-Whk1421hNcko';
const facebookAccessTokenLabel = 'LwpR*imf9-0831Nab.yh!';
const googleTokenLabel = 'C01.9-2h*j*ad!nKyyTuoif';
/* COOKIES */

/* STORES */
export const navigationStoreLabel = 'nKyyTuoif*LwpR';
export const spotlightStoreLabel = '5tpCLpT2YYifmLPLBu';
export const showStoreLabel = 'aFsS5-F9s6d*5faD9F5F9ASD';
export const storeEncryptKey = 'FM0LXbBgrpejm7Bsg9LBJlAvRh';
/*  */

/* API KEYS */
const youTubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
/* API KEYS */

const AppConstants = {
    defaultPageLayout,
    tokenLabel,
    bandIdLabel,
    fanIdLabel,
    ticketScanningShowIdLabel,
    facebookAccessTokenLabel,
    googleTokenLabel,
    redirectUrlLabel,
    sidebarWidth,
    spotlightStoreLabel,
    storeEncryptKey,
    youTubeApiKey,
};

export default AppConstants;
