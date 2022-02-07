import type MusicalGenre from '../musicalGenre';
import type FileModel from '../fileModel';
import type BandMedia from './bandMedia';
import type BandSocialMedia from './bandSocialMedia';
import type BandYTVideo from './bandYTVideo';

type Band = {
    id: string;
    name: string;
    description: string;
    hometown: string;

    genreTags?: MusicalGenre[];
    selectedGenreTags?: string[];

    profilePicture?: FileModel;
    profilePictureId?: string;

    qrcodeFileId?: string;
    ytVideos?: BandYTVideo[];
    medias?: BandMedia[];
    socialMedias?: BandSocialMedia[];
};

export default Band;
