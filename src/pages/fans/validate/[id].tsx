import { useEffect } from 'react';
import { FinishRegistration } from 'src/components';
import useAuth from 'src/hooks/useAuth';
import { ApiRoutes, TrackActions, UiRoutes } from 'src/constants';
import TrackService from 'src/services/trackService';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import api from 'src/utils/api';
import type { BaseResponse, FinishRegisterModel, PendingFan } from 'src/types';
import { useLayout } from 'src/hooks';

type ValidateFanProps = {
    pending: PendingFan;
};

const ValidateFan = ({ pending }: ValidateFanProps) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { setToken } = useAuth();
    useLayout('simple');
    useEffect(() => {
        if (!pending) {
            enqueueSnackbar('Pending fan not found!', { variant: 'error' });
            router.push(UiRoutes.Auth.Login);
        }
    }, []);

    const validate = async (values: FinishRegisterModel) => {
        pending.firstName = values.firstName;
        pending.lastName = values.lastName;
        pending.username = values.username;
        pending.password = values.password;
        pending.confirmPassword = values.confirmPassword;

        const response: BaseResponse<string> = await api.post(
            ApiRoutes.Fans.FinishRegistration,
            pending
        );
        if (response.success) {
            const trackObj = {
                firstName: pending.firstName,
                lastName: pending.lastName,
                username: pending.username,
                userType: 'FAN',
            };
            TrackService.trackAction(
                TrackActions.USER_ACTIVATED,
                trackObj,
                null
            );
            await setToken(response.data);
        } else {
            enqueueSnackbar(response.message, { variant: 'error' });
        }
    };

    const renderRegistration = () => {
        if (!pending) {
            return <div />;
        }

        return <FinishRegistration submitFunc={(values) => validate(values)} />;
    };

    return renderRegistration();
};

ValidateFan.propTypes = {
    pending: PropTypes.any,
};

export async function getServerSideProps(context) {
    const { id } = context.query;
    const response: BaseResponse<PendingFan> = await api.get(
        ApiRoutes.Fans.GetPending(id)
    );
    let pending: PendingFan = null;
    if (response.success) {
        pending = response.data;
    }

    return { props: { pending } };
}

export default ValidateFan;
