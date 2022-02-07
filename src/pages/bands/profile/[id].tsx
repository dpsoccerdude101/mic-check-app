import { useEffect, useState } from 'react';
import { ApiRoutes } from 'src/constants';
import { navPaddingTop, navbarHeight } from 'src/constants/appConstants';
import { makeStyles } from '@material-ui/core';
import {
    BandProfileHeader,
    BandProfileTabs,
    PageWrapperNoPadding,
} from 'src/components';
import { Band, BaseResponse } from 'src/types';
import { useAuth } from 'src/hooks';
import { Api } from 'src/utils';
import { useNavigationStore } from 'src/stores';

const useStyles = makeStyles({
    root: {
        marginTop: navbarHeight - navPaddingTop,
    },
});

type BandProfileProps = {
    band: Band;
};

const BandProfile = ({ band }: BandProfileProps) => {
    const {
        description,
        genreTags,
        hometown,
        id,
        name,
        socialMedias,
        profilePictureId,
    } = band;
    const classes = useStyles();
    const [imgString, setImgString] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [fanId, setFanId] = useState(null);
    const { user } = useAuth();
    let genresString = [];
    if (genreTags && genreTags.length > 0) {
        genresString = genreTags.map((item) => item.name);
    }

    const { showNavBar } = useNavigationStore((state) => ({
        showNavBar: state.showNavBar,
    }));

    useEffect(() => {
        const loadProfilePicture = async () => {
            const srcString = ApiRoutes.Files.GetFile(profilePictureId);
            setImgString(srcString);
        };

        const checkIfIsFan = async () => {
            const response: BaseResponse<boolean> = await Api.get(
                ApiRoutes.Fans.IsFanFromBand(id)
            );
            const { data, success } = response;
            if (success) {
                setIsFavorite(data);
            }
        };

        const checkIfIsUser = async () => {
            if (user?.isFan) {
                const userFanId = user.fanId;
                setFanId(userFanId);
            }
        };

        loadProfilePicture();
        checkIfIsFan();
        checkIfIsUser();
        showNavBar();
    }, [band]);

    return (
        <PageWrapperNoPadding
            className={classes.root}
            title={`${name} - Profile`}
        >
            <BandProfileHeader
                bandId={id}
                isFavorite={isFavorite}
                fanId={fanId}
                isPreview={false}
                hometown={hometown}
                imgSrc={imgString}
                name={name}
                genreTags={genresString}
            />
            <BandProfileTabs
                bandId={id}
                name={name}
                description={description}
                hometown={hometown}
                socialMedias={socialMedias}
            />
        </PageWrapperNoPadding>
    );
};

export async function getServerSideProps(context) {
    const { id } = context.query;
    const bandResponse: BaseResponse<Band> = await Api.get(
        ApiRoutes.Bands.Get(id),
        context
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
    return { props: { band } };
}

export default BandProfile;
