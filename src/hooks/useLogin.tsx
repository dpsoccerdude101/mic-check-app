import { useContext } from 'react';
import { LoginContext } from '../contexts';

const useLogin = () => useContext(LoginContext);

export default useLogin;
