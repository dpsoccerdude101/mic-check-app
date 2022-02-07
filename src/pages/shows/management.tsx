import { PageWrapper, ShowManagement } from 'src/components';
import APP_PERMISSIONS from 'src/constants/permissions';

const Management = () => (
  <PageWrapper title='Show Management'>
    <ShowManagement bandId={null} />
  </PageWrapper>
);

export async function getStaticProps() {
  return {
    props: {
      requiredPermissions: [
        APP_PERMISSIONS.Bands.Shows.Add,
      ]
    }
  }
}

export default Management;
