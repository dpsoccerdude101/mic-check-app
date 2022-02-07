import { PageWrapper } from "src/components";
import ShowsListWrapper from "src/components/shows/showsListWrapper";
import { ApiRoutes } from "src/constants";
import APP_PERMISSIONS from "src/constants/permissions";
import { DataTableProvider } from "src/contexts";
import { BaseResponse, ListResponse, PagePermission, Show } from "src/types";
import { Api } from "src/utils";

type PageProps = {
  data: ListResponse<Show>
} & PagePermission;

const ShowsListPage = ({
  data,
  requiredPermissions = [
    APP_PERMISSIONS.Shows.List,
  ]
}: PageProps) => (
  <PageWrapper title='List of Shows'>
      <DataTableProvider>
        <ShowsListWrapper />
      </DataTableProvider>
  </PageWrapper>
);

export async function getServerSideProps(context) {
  const response: BaseResponse<ListResponse<Show>> = await Api.get(`${ApiRoutes.Shows.GetAll}?Sorting=date&MaxResultCount=5`, context);
  const { data, success } = response;
  let listResponse: ListResponse<Show> = null;
  if (success) {
    listResponse = data;
  }
  return {
    props: {
      data: listResponse,
      requiredPermissions: [
        APP_PERMISSIONS.Shows.List,
      ]
    }
  };
}

export default ShowsListPage;