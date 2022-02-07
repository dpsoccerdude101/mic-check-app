import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { experimentalStyled } from '@material-ui/core';
import { useAuth } from 'src/hooks';
import MainHeader from '../mainHeader';
import SimpleLayout from './simpleLayout';

export const siteTitle = 'MicCheck';

interface LayoutProps {
    children?: ReactNode;
}

const LayoutRoot = experimentalStyled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
}));

// ADC 2021-09-18 - I don't think this layout serves a purpose anymore. Time to delete?
const UnauthorizedLayout: FC<LayoutProps> = (props) => {
    const { children } = props;
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? null : <SimpleLayout>{children}</SimpleLayout>;
};

UnauthorizedLayout.propTypes = {
    children: PropTypes.any,
};

export default UnauthorizedLayout;
