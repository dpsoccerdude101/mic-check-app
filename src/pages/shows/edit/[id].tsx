import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PageWrapper, ShowManagement } from 'src/components';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';
import { ApiRoutes } from 'src/constants';
import api from 'src/utils/api';
import type { BaseResponse, PagePermission, Show } from 'src/types';
import { useShowStore } from 'src/stores';
import APP_PERMISSIONS from 'src/constants/permissions';

type EditShowProps = {
  show: Show;
} & PagePermission;

const EditShow = ({
  show,
  requiredPermissions = [
    APP_PERMISSIONS.Shows.Edit,
  ]
}: EditShowProps) => {
  const { user, goHome } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { setId } = useShowStore((state) => ({ setId: state.setId }));

  useEffect(() => {
    if (!show) {
      enqueueSnackbar('Show not found!', { variant: 'error' });
      goHome();
    } else { setId(show.id); }
  }, [show]);

  return show ? (
    <PageWrapper title='Edit show'>
      <ShowManagement show={show} bandId={user.bandId} />
    </PageWrapper>
  )
    : null;
};

EditShow.propTypes = {
  show: PropTypes.any.isRequired
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const showsResponse: BaseResponse<Show> = await api.get(ApiRoutes.Shows.Get(id));
  let show: Show = null;
  if (showsResponse.success) {
    show = showsResponse.data;
  }

  return {
    props: {
      show,
      requiredPermissions: [
        APP_PERMISSIONS.Shows.Edit,
      ]
    }
  };
}

export default EditShow;
