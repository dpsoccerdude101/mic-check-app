import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { DataTableWrapper } from 'src/components';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { useAuth, useDataTable, useDialog } from 'src/hooks';
import { Action, BaseResponse, Column, ListResponse, SetDialogProps, Show } from 'src/types';
import { Api } from 'src/utils';

const ShowsListWrapper = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();
  const { setReloadGrid } = useDataTable();

  const confirmDelete = (show: Show) => {
    const dialogProps: SetDialogProps = {
      title: `Confirm Delete`,
      text: 'Are you sure you want to delete this show?',
      submitText: 'OK',
      submitHandler: async () => {
        const response = await Api.delete(
            ApiRoutes.Shows.Delete(show.id)
        );
        const { message, success } = response;
        if (success) {
            setReloadGrid(true);
            router.reload();
        } else {
            enqueueSnackbar(message, { variant: 'error' });
        }
      },
      cancelText: 'Cancel',
    };
    showDialog(dialogProps);
  };

  const columns: Column[] = [
    { id: 'name', label: 'Show Name', sortable: true },
    { id: 'date', label: 'Date', sortable: true, format: (d) => {
        const date = new Date(d);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }},
    { id: 'venueName', label: 'Venue' },
    { id: 'actions', label: '', sortable: false },
  ];

  const rowActions: Action[] = [
    {
      id: 'edit',
      label: 'Edit',
      onClick: async (show) => {
          router.push(UiRoutes.Shows.Edit(show.id));
      },
      fixed: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      onClick: async (show) => {
          confirmDelete(show);
      },
      fixed: true,
    },
  ];

  const createNewShow = () => router.push(UiRoutes.Shows.Management);

  const loadShows = async (rowsPerPage: number, skip: number) => {
    const url = `${ApiRoutes.Shows.GetAll}?Sorting=date&MaxResultCount=${rowsPerPage}&SkipCount=${skip}`;
    const response: BaseResponse<ListResponse<Show>> = await Api.get(url);
    const { data, success } = response;
    if (success) {
      return data;
    }
  };

  const searchBy = async (searchValue: string, rowsPerPage: number, skip: number) => {
    const url = `${ApiRoutes.Shows.GetAll}?Keyword=${searchValue}&Sorting=date&MaxResultCount=${rowsPerPage}&SkipCount=${skip}`;
    const response: BaseResponse<ListResponse<Show>> = await Api.get(url);
    const { data, success } = response;
    console.log(response)
    if (success) {
      return data;
    }
  };

    return (
      <DataTableWrapper
          fetchData={loadShows}
          addHandler={createNewShow}
          onSearch={searchBy}
          columns={columns}
          rowActions={rowActions}
          headerText="All Shows"
          actionButtonText="Add Show"
          noResultText="No shows were found!" />
    );
}

export default ShowsListWrapper;