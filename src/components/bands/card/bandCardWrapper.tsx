import { ChildrenProps } from 'src/types';
import { UiRoutes } from 'src/constants';
import { useRouter } from 'next/router';
import CardWrapper from 'src/components/cardWrapper';

type BandCardWrapperProps = ChildrenProps & {
  cardTop: JSX.Element;
  bandId?: string;
  wrapperClass?: string
};

const BandCardWrapper = ({ bandId, cardTop, children, wrapperClass = '' }: BandCardWrapperProps) => {
  const router = useRouter();

  const redirectToBandProfile = async () => {
    await router.push(UiRoutes.Bands.Profile(bandId));
  };

  return <CardWrapper handleClick={redirectToBandProfile} cardTop={cardTop} wrapperClass={wrapperClass}>{children}</CardWrapper>;
};

export default BandCardWrapper;
