import { useEffect } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useRouter } from 'next/router';
import UiRoutes from 'src/constants/uiRoutes';

export default function Home() {
  const { goHome, isAuthenticated } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(UiRoutes.Auth.Login);
    } else {
      goHome();
    }
  }, []);
  return <div />;
}
