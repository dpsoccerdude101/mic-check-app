import Head from 'next/head';
import { Images } from 'src/constants';

const MainHeader = () => (
  <Head>
    <link
      rel='icon'
      href='/favicon.ico'
    />
    <meta
      name='description'
      content='MicCheck is the social network for bands and fans!'
    />
    <meta
      property='og:image'
      content={Images.HorizontalLogo}
    />
    <meta
      name='og:title'
      content='MicCheck'
    />
    <meta
      name='twitter:card'
      content='summary_large_image'
    />
  </Head>
);

export default MainHeader;
