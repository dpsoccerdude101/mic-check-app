import { NoImagePlaceholder } from 'src/constants/images';
import { useEffect, useState } from 'react';

type CustomImageProps = {
  className?: string;
  imgSrc: string;
  title: string;
  extraProps?: any;
};

const CustomImage = ({ className, imgSrc, title, extraProps }: CustomImageProps) => {
  const [imgData, setImgData] = useState(imgSrc);

  useEffect(() => {
    setImgData(imgSrc);
  }, [imgSrc]);

  const handleError = () => {
    setImgData(NoImagePlaceholder);
  };

  return (
    <img
      style={{ backgroundImage: NoImagePlaceholder }}
      src={imgData}
      onError={handleError}
      title={title}
      alt={title}
      className={className}
      {...extraProps}
    />
  );
};

export default CustomImage;
