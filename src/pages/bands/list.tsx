import { BandListWrapper, PageWrapper } from 'src/components';
import { BandAdminProvider, DataTableProvider } from 'src/contexts';
import { Api } from 'src/utils';
import { ApiRoutes } from 'src/constants';
import { Band, BaseResponse, ListResponse, PagePermission } from 'src/types';
import APP_PERMISSIONS from 'src/constants/permissions';

type ListProps = {
  listResponse: ListResponse<Band>
} & PagePermission;

const List = ({
  listResponse,
  requiredPermissions = [
    APP_PERMISSIONS.Bands.List,
  ]
}: ListProps) => (
  <PageWrapper title='List of bands'>
    <BandAdminProvider>
      <DataTableProvider>
        <BandListWrapper listResponse={listResponse} />
      </DataTableProvider>
    </BandAdminProvider>
  </PageWrapper>
);

export async function getServerSideProps(ctx) {
  const response: BaseResponse<ListResponse<Band>> = await Api.get(`${ApiRoutes.Bands.GetAll}?Sorting=name&MaxResultCount=5`, ctx);
  const { data, success } = response;
  let listResponse: ListResponse<Band> = null;
  if (success) {
    listResponse = data;
  }
  return {
    props: {
      listResponse,
      requiredPermissions: [
        APP_PERMISSIONS.Bands.List,
      ]
    }
  };
}

export default List;
