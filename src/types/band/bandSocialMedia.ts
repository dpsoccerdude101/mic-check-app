import SocialMedia from '../socialMedia';

type BandSocialMedia = {
  bandId: string;
  socialMediaId: number;
  socialMedia?: SocialMedia;
  url?: string;
};

export default BandSocialMedia;
