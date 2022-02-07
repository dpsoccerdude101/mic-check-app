import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';

export default function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    const signOut = async () => {
      await logout();
    };
    signOut();
  }, []);

  return <div />;
}
