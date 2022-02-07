import SocialProviderEnum from './socialProviderEnum';

type SocialLoginRequest = {
  type: SocialProviderEnum,
  accessToken: string
};

export default SocialLoginRequest;
