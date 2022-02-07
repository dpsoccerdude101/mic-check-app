import { FC, ReactNode, useState } from 'react';
import { layoutContainerId, navPaddingTop, sidebarWidth } from 'src/constants/appConstants';
import { BandsSearch } from 'src/components';
import { useNavigationStore } from 'src/stores';
import { useSearch } from 'src/hooks';
import PropTypes from 'prop-types';
import { experimentalStyled } from '@material-ui/core';
import MainHeader from '../mainHeader';
import NavSidebar from '../navigation/navSidebar';
import NavBar from '../navigation/navBar';

export const siteTitle = 'MicCheck';

interface LayoutProps {
  children?: ReactNode;
}

const LayoutRoot = experimentalStyled('div')(
  ({ theme }) => (
    {
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      width: '100%',
    }
  )
);

const LayoutWrapper = experimentalStyled('div')(
  ({ theme }) => (
    {
      display: 'flex',
      flex: '1 1 auto',
      overflow: 'hidden',
      [theme.breakpoints.up('lg')]: {
        paddingLeft: sidebarWidth
      }
    }
  )
);

const LayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const NavLayout: FC<LayoutProps> = (props) => {
  const { children } = props;
  const { isSearchOpen } = useSearch();
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const isNavBarVisible = useNavigationStore((state) => state.isNavBarVisible);

  const renderSearchIfNeeded = () => (
    isSearchOpen ? <BandsSearch /> : children
  );
  return (
    <div>
      <MainHeader />
      <main>
        <LayoutRoot>
          <NavBar onSidebarMobileOpen={(): void => setIsSidebarMobileOpen(true)} />
          <NavSidebar
            onMobileClose={(): void => setIsSidebarMobileOpen(false)}
            openMobile={isSidebarMobileOpen}
          />
          <LayoutWrapper>
            <LayoutContainer>
              <div
                id={layoutContainerId}
                style={{
                  flex: '1 1 auto',
                  height: '100%',
                  overflow: 'auto',
                  position: 'relative',
                  WebkitOverflowScrolling: 'touch',
                  paddingTop: isNavBarVisible ? navPaddingTop : 0
                }}
              >
                {renderSearchIfNeeded()}
              </div>
            </LayoutContainer>
          </LayoutWrapper>
        </LayoutRoot>
      </main>
    </div>
  );
};

NavLayout.propTypes = {
  children: PropTypes.any
};

export default NavLayout;
