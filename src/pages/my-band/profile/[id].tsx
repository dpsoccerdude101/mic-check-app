import api from 'src/utils/api';
import PropTypes from 'prop-types';
import { BandProfileSwitcher, PageWrapper } from 'src/components';
import {
    BandProvider,
    BandGeneralProvider,
    BandVideosProvider,
    BandYTVideosProvider,
} from 'src/contexts';
import { BandLinksProvider } from 'src/contexts/band/bandLinksContext';
import type { Band, BaseResponse } from 'src/types';
import { ApiRoutes } from '../../../constants';
import APP_PERMISSIONS from 'src/constants/permissions';

const Profile = ({ 
    band, 
    requiredPermissions = [
        APP_PERMISSIONS.Users.Profile.View,
        APP_PERMISSIONS.Bands.Profile.View,
    ] 
}) => {
    let title = 'Band Profile';
    if (band && band.id) title += ` - ${band.name}`;

    return (
        <PageWrapper title={title}>
            <BandProvider loadedBand={band}>
                <BandGeneralProvider>
                    <BandLinksProvider>
                        <BandYTVideosProvider>
                            <BandVideosProvider>
                                <BandProfileSwitcher />
                            </BandVideosProvider>
                        </BandYTVideosProvider>
                    </BandLinksProvider>
                </BandGeneralProvider>
            </BandProvider>
        </PageWrapper>
    );
};

Profile.propTypes = {
    band: PropTypes.any,
};

export async function getServerSideProps(context) {
    const { id } = context.query;
    const bandResponse: BaseResponse<Band> = await api.get(
        ApiRoutes.Bands.Get(id)
    );
    let band: Band = null;
    if (bandResponse.success) {
        band = bandResponse.data;
        if (band.hometown === null) {
            band.hometown = '';
        }
        if (band.description === null) {
            band.description = '';
        }
    }
    return {
        props: {
            band,
            requiredPermissions: [
                APP_PERMISSIONS.Users.Profile.View,
                APP_PERMISSIONS.Bands.Profile.View,
            ]
        }
    };
}

export default Profile;
