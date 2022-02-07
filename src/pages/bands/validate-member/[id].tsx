import { useEffect } from 'react';
import { FinishRegistration } from 'src/components';
import useAuth from 'src/hooks/useAuth';
import { ApiRoutes, TrackActions, UiRoutes } from 'src/constants';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import TrackService from 'src/services/trackService';
import api from 'src/utils/api';
import type {
    BaseResponse,
    FinishRegisterModel,
    PendingMember,
} from 'src/types';
import { useLayout } from 'src/hooks';

type ValidateBandMemberProps = {
    pendingMember: PendingMember;
};

const ValidateBandMember = ({ pendingMember }: ValidateBandMemberProps) => {
    useLayout('simple');
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { setToken } = useAuth();
    useEffect(() => {
        if (!pendingMember) {
            enqueueSnackbar('Pending Member not found!', { variant: 'error' });
            router.push(UiRoutes.Auth.Login);
        }
    }, []);

    const validateMember = async (values: FinishRegisterModel) => {
        pendingMember.firstName = values.firstName;
        pendingMember.lastName = values.lastName;
        pendingMember.username = values.username;
        pendingMember.password = values.password;
        pendingMember.confirmPassword = values.confirmPassword;

        const response: any = await api.post(
            ApiRoutes.Bands.ValidateMember,
            pendingMember
        );
        if (response.success) {
            const trackObj = {
                firstName: pendingMember.firstName,
                lastName: pendingMember.lastName,
                username: pendingMember.username,
                userType: 'BAND MEMBER',
            };
            TrackService.trackAction(
                TrackActions.USER_ACTIVATED,
                trackObj,
                null
            );
            await setToken(response.token);
        } else {
            enqueueSnackbar(response.message, { variant: 'error' });
        }
    };

    const renderRegistration = () => {
        if (!pendingMember) {
            return <div />;
        }

        return (
            <FinishRegistration
                isBandMember
                submitFunc={(values) => validateMember(values)}
            />
        );
    };

    return renderRegistration();
};

ValidateBandMember.propTypes = {
    pendingMember: PropTypes.any,
};

export async function getServerSideProps(context) {
    const { id } = context.query;
    const response: BaseResponse<PendingMember> = await api.get(
        ApiRoutes.Bands.GetPendingMember(id)
    );
    let pendingMember: PendingMember = null;
    if (response.success) {
        pendingMember = response.data;
    }

    return { props: { pendingMember } };
}

export default ValidateBandMember;
