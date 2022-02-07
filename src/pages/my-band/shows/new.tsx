import { PageWrapper, ShowManagement } from 'src/components';
import APP_PERMISSIONS from 'src/constants/permissions';
import useAuth from 'src/hooks/useAuth';

const NewShow = ({
  requiredPermissions = [
    APP_PERMISSIONS.Shows.Add,
    APP_PERMISSIONS.Bands.Shows.Add,
  ]
}) => {
  const { user } = useAuth();

  return (
    <PageWrapper title='Add Show'>
      <ShowManagement bandId={user.bandId} />
    </PageWrapper>
  );
};

export async function getStaticProps() {
  return {
    props: {
      requiredPermissions: [
        APP_PERMISSIONS.Shows.Add,
        APP_PERMISSIONS.Bands.Shows.Add,
      ]
    }
  }
}

export default NewShow;
