import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { experimentalStyled } from '@material-ui/core';
import { useAuth } from 'src/hooks';
import MainHeader from '../mainHeader';
import { layoutContainerId } from 'src/constants/appConstants';

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

const SimpleLayout: FC<LayoutProps> = (props) => {
    const { children } = props;
    return (
        <div>
            <MainHeader />
            <main>
                <LayoutRoot>
                    <div id={layoutContainerId}>{children}</div>
                </LayoutRoot>
            </main>
        </div>
    );
};

SimpleLayout.propTypes = {
    children: PropTypes.any,
};

export default SimpleLayout;
