import { LoginProvider } from 'src/contexts';
import LoginComponents from './loginComponents';

const LoginPage = () => (
  <LoginProvider><LoginComponents /></LoginProvider>
);

export default LoginPage;
