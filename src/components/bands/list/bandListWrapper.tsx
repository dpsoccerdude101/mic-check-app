import { useEffect, useState } from 'react';
import { useAuth, useBandAdmin, useDataTable, useDialog } from 'src/hooks';
import type { Action, Band, BaseResponse, Column, ListResponse, SetDialogProps } from 'src/types';
import NewBandDialog from './newBandDialog';
import { DataTableWrapper } from 'src/components';
import { useRouter } from 'next/router';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import { useSnackbar } from 'notistack';

type ListProps = {
  listResponse: ListResponse<Band>
};

const BandListWrapper = ({ listResponse }: ListProps) => {
  const router = useRouter();
  const { list, setList, setShowAddBandDialog, deleteBand } = useBandAdmin();
  const [loaded, setLoaded] = useState(false);
  const { user, setBandIdForAdmin } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { showDialog } = useDialog();
  
  useEffect(() => {
    if (!loaded && list.length === 0 && listResponse) {
      setList(listResponse);
      setLoaded(true);
    }
  });

  const columns: Column[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'hometown', label: 'Hometown' },
    { id: 'actions', label: '', sortable: false },
  ];

  const rowActions: Action[] = [
    {
      id: 'shows',
      label: 'Shows',
      onClick: async (band) => {
          setBandIdForAdmin(band.id);
          router.push(UiRoutes.MyBand.Shows.List(band.id));
      },
    },
    {
      id: 'profile',
      label: 'Profile',
      onClick: async (band) => {
        setBandIdForAdmin(band.id);
        router.push(UiRoutes.MyBand.Profile(band.id));
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      onClick: async (band) => {
        setBandIdForAdmin(band.id);
        router.push(UiRoutes.MyBand.Settings(band.id));
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      onClick: async (band) => {
          confirmDelete(band);
      },
      fixed: true,
    },
  ];

  const loadBands = async (rowsPerPage: number, skip: number) => {
    const url = `${ApiRoutes.Bands.GetAll}?Sorting=name&MaxResultCount=${rowsPerPage}&SkipCount=${skip}`;
    const response: BaseResponse<ListResponse<Band>> = await Api.get(url);
    const { data, success } = response;
    if (success) {
      return data;
    }
  };

  const searchBy = async (searchValue: string, rowsPerPage: number, skip: number) => {
    const url = `${ApiRoutes.Bands.GetAll}?Keyword=${searchValue}&Sorting=name&MaxResultCount=${rowsPerPage}&SkipCount=${skip}`;
    const response: BaseResponse<ListResponse<Band>> = await Api.get(url);
    const { data, success } = response;
    if (success) {
      return data;
    }
  };

  const showAddBandDialog = () => {
    setShowAddBandDialog(true);
  };

  const { setReloadGrid } = useDataTable();

  const confirmDelete = (band: Band) => {
    const dialogProps: SetDialogProps = {
      title: `Do you want to delete the band ${band.name}?`,
      text: 'This action is irreversible.',
      submitText: 'Delete',
      submitHandler: async () => {
        const response: BaseResponse = await deleteBand(band);
        const { message, success } = response;
        if (success) {
          if (user.bandId === band.id) { setBandIdForAdmin(null); }
          setReloadGrid(true);
        } else {
          enqueueSnackbar(message, { variant: 'error' });
        }
      },
      cancelText: 'Cancel',
    };
    showDialog(dialogProps);
  };

  return (
    <>
      <NewBandDialog />

      <DataTableWrapper
        fetchData={loadBands}
        addHandler={showAddBandDialog}
        onSearch={searchBy}
        columns={columns}
        rowActions={rowActions}
        headerText="List of bands"
        actionButtonText="Add Band"
        noResultText="No bands were found!" />
    </>
  );
};

export default BandListWrapper;
