import { Box, Divider, List, Drawer } from '@material-ui/core';
import { useRouter } from 'next/router';
import { sidebarWidth } from 'src/constants/appConstants';
import PropTypes from 'prop-types';
import type { User, MenuItem } from 'src/types';
import { UserMenu } from './menus';
import Logo from '../logo';
import NavItem from './navItem';
import useAuth from '../../hooks/useAuth';

const checkIfIsActive = (pathname: string, itempath: string): boolean => {
  let isActive = itempath ? itempath === pathname : false;
  if (!isActive && pathname.includes('[id]')) {
    let split = pathname.split('/');
    const cleanPath = split.slice(0, split.length - 1).join('/');
    split = itempath.split('/');
    const cleanItem = split.slice(0, split.length - 1).join('/');
    isActive = cleanPath === cleanItem;
  }
  return isActive;
};

const renderNavItems = (userPermissions: string[], items: MenuItem[], pathname: string, closeDrawer: () => void): JSX.Element => (
  <List disablePadding>
    {items.filter(i => i.display).map((item) => {
      if (!item.permissions || userPermissions.some(p => item.permissions.includes(p))) {
        const key = `${item.title}-${item.path}`;
        const isActive = checkIfIsActive(pathname, item.path);
        
        const children = item.children ? item.children.filter(i => i.display).map(child => ({
          active: checkIfIsActive(pathname, child.path),
          icon: child.icon,
          path: child.path,
          title: child.title,
          closeDrawer: closeDrawer
        })) : null;
  
        return (
          <NavItem
            key={key}
            active={isActive}
            closeDrawer={closeDrawer}
            icon={item.icon}
            path={item.path}
            title={item.title}
            children={children}
          />
        ); 
      }
    })}
    <Divider style={{ background: 'white', marginTop: 15 }} />
  </List>
);

const getMenuForUser = (user: User): MenuItem[] => UserMenu(user);

interface NavSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const NavSidebar = (props: NavSidebarProps) => {
  const { onMobileClose, openMobile } = props;
  const { user, isAuthenticated } = useAuth();
  
  const userPermissions = isAuthenticated ? user.permissions.filter(x => x.isGranted).map(x => x.name) : [];
  
  const items: MenuItem[] = getMenuForUser(user);
  const router = useRouter();
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{ p: 2 }}
      >
        <Logo width={220} height={50} />
        <List>
          {renderNavItems(userPermissions, items, router.pathname, onMobileClose)}
        </List>
      </Box>
    </Box>
  );

  return (
    <nav>
      <Drawer
        anchor='left'
        open
        sx={{ display: { xs: 'none', lg: 'block' } }}
        PaperProps={{
          sx: {
            width: sidebarWidth
          }
        }}
        variant='persistent'
      >
        {content}
      </Drawer>
      <Drawer
        sx={{ display: { xs: 'block', lg: 'none' } }}
        anchor='left'
        onClose={onMobileClose}
        open={openMobile}
        PaperProps={{
          sx: {
            width: sidebarWidth
          }
        }}
        variant='temporary'
      >
        {content}
      </Drawer>
    </nav>
  );
};

NavSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavSidebar;
