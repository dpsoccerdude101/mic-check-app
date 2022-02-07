import { useEffect } from 'react';
import { useAuth } from 'src/hooks';
import Cookies from 'js-cookie';
import queryString from 'query-string';
import TrackService from 'src/services/trackService';
import { AppConstants, ApiRoutes, UiRoutes, TrackActions } from 'src/constants';
import { Band, BaseResponse, QRCodeUserScanRequest, QRCodeUserScanResponse } from 'src/types';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Api } from 'src/utils';

type BandQRCodePageProps = {
  loadResponse: BaseResponse<Band>;
};

const BandQRCodePage = ({ loadResponse }: BandQRCodePageProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const redirectToLogin = (bandId: string) => {
      enqueueSnackbar('Please login to access content!', { variant: 'info' });
      // Redirect to this page after logged in to register logged access
      Cookies.set(AppConstants.redirectUrlLabel, `/qrcode/band/${bandId}`, { expires: 365 });
      router.push(UiRoutes.Auth.Login);
    };

    const redirectToBandProfile = (bandId: string) => {
      router.push(UiRoutes.Bands.Profile(bandId));
    };

    const registerAccess = async (userId: string) => {
      console.log(`Registering access of user ${userId}...`);
      const bandId = loadResponse.data.id;
      const request: QRCodeUserScanRequest = {
        userId,
        bandId
      };

      const url = `${ApiRoutes.QRCode.GetUserScanObj}?${queryString.stringify(request)}`;
      const response: BaseResponse<QRCodeUserScanResponse> = await Api.get(url);
      const { data, message, success } = response;
      if (success) {
        TrackService.trackAction(TrackActions.USER_SCANNED_QRCODE, data, user);
      } else {
        enqueueSnackbar(message, { variant: 'error' });
      }
      console.log('Done!');
    };

    const checkIfSucceded = () => {
      const { data, message, success } = loadResponse;
      if (success) {
        const { id } = data;
        const isLoggedIn = user && user.id;
        if (!isLoggedIn) {
          redirectToLogin(id);
          return;
        }

        Cookies.remove(AppConstants.redirectUrlLabel);
        registerAccess(user.id);
        redirectToBandProfile(id);
      } else {
        enqueueSnackbar(message, { variant: 'error' });
        router.push(UiRoutes.Auth.Login);
      }
    };

    checkIfSucceded();
  }, []);

  return null;
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const loadResponse: BaseResponse<Band> = await Api.get(ApiRoutes.Bands.Get(id), context);
  return { props: { loadResponse } };
}

export default BandQRCodePage;
