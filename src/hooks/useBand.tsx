import { useContext } from 'react';
import BandLinksContext from 'src/contexts/band/bandLinksContext';
import {
    BandAdminContext,
    BandContext,
    BandGeneralContext,
    BandVideosContext,
    BandYTVideosContext,
} from '../contexts';

export const useBandAdmin = () => useContext(BandAdminContext);
export const useBandGeneral = () => useContext(BandGeneralContext);
export const useBandLinks = () => useContext(BandLinksContext);
export const useBandVideos = () => useContext(BandVideosContext);
export const useBandYTVideos = () => useContext(BandYTVideosContext);

const useBand = () => useContext(BandContext);
export default useBand;
