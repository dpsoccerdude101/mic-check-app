import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CustomLoaderFullPage from './custom/customLoaderFullPage';

const LoaderScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = async () => {
      setLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const renderLoader = () => {
    if (loading) {
      return (
        <CustomLoaderFullPage />
      );
    }

    return null;
  };

  return renderLoader();
};

export default LoaderScreen;
