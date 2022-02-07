import { Images } from 'src/constants';
import Image from 'next/image';
import PropTypes from 'prop-types';

const { HorizontalLogo } = Images;

type LogoProps = {
  height?: number;
  width?: number;
};

const Logo = ({ height, width }: LogoProps) => (
  <Image
    src={HorizontalLogo}
    alt='MicCheck logo'
    height={height}
    width={width}
  />
);

Logo.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
};

export default Logo;
