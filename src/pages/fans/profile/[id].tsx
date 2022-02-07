import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import { FanProfileForm, PageWrapper } from 'src/components';
import { NextPageContext } from 'next';
import type { BaseResponse, FanProfile } from 'src/types';

interface ProfileProps {
  fanProfile: FanProfile | null
}

const Profile = ({ fanProfile }: ProfileProps) => (fanProfile ? <PageWrapper title='My profile'><FanProfileForm fan={fanProfile} /></PageWrapper> : null);

export async function getServerSideProps(context: NextPageContext) {
  const { id } = context.query;
  const response: BaseResponse<FanProfile> = await Api.get(ApiRoutes.Fans.GetProfile(id), context);
  let fanProfile: FanProfile = null;
  if (response.success) {
    fanProfile = response.data;
    fanProfile.currentPassword = '';
    fanProfile.newPassword = '';
    fanProfile.confirmPassword = '';
  }
  return { props: { fanProfile } };
}

export default Profile;
