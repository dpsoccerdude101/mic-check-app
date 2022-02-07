import { FanSpotlightDto } from 'src/types';
import { SpotlightsService } from 'src/services';
import { useSpotlightStore } from 'src/stores';
import { useEffect } from 'react';
import SelectedSpotlightPage from 'src/components/fans/feed/spotlight/selectedSpotlightPage';

type SpotlightProps = {
  model: FanSpotlightDto
};

const Spotlight = ({ model }: SpotlightProps) => {
  const { setSelectedSpotlight } = useSpotlightStore((state) => ({ setSelectedSpotlight: state.setSelectedSpotlight }));
  useEffect(() => {
    if (model) { setSelectedSpotlight(model); }
  }, []);

  return <SelectedSpotlightPage />;
};

export async function getServerSideProps(context) {
  const { id } = context.query;
  const model: FanSpotlightDto = await SpotlightsService.getSpotlight(id, context);
  return { props: { model } };
}

export default Spotlight;
