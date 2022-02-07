import { useContext } from 'react';
import { SpotlightsContext } from 'src/contexts';

const useSpotlights = () => useContext(SpotlightsContext);
export default useSpotlights;
