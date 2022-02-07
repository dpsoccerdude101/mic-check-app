import { useEffect } from 'react';
import { ChildrenProps } from 'src/types';
import { Helmet } from 'react-helmet-async';
import TrackService from 'src/services/trackService';

type PageWrapperNoPaddingProps = {
  className?: string;
  title: string;
};

const PageWrapperNoPadding = ({ children, className, title }: PageWrapperNoPaddingProps & ChildrenProps) => {
  useEffect(() => {
    TrackService.page(title);
  }, []);
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className={className}>
        {children}
      </div>
    </>
  );
};

export default PageWrapperNoPadding;
