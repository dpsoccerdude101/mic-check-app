import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import { AppBar, IconButton, InputBase, Link, Typography, Toolbar } from '@material-ui/core';
import { Colors } from 'src/constants';
import { navbarHeight, sidebarWidth } from 'src/constants/appConstants';
import { experimentalStyled } from '@material-ui/core/styles';
import { Menu } from '@material-ui/icons';
import { useNavigationStore } from 'src/stores';
import { useSearch } from 'src/hooks';
import type { AppBarProps } from '@material-ui/core';
import type { FC } from 'react';
import { useEffect } from 'react';

interface NavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void;
}
const NavbarRoot = experimentalStyled(AppBar)(
  ({ theme }) => (
    {
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${sidebarWidth}px )`
      },
      zIndex: theme.zIndex.drawer + 100
    }
  )
);
const Search = experimentalStyled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: Colors.SECONDARY,
  marginLeft: 20,
  fontSize: '.8rem',
  fontFamily: 'sofia-pro',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto'
  },
}));
const SearchIconWrapper = experimentalStyled('div')(({ theme }) => ({
  color: Colors.COLOR_5,
  padding: theme.spacing(0, 2),
  paddingRight: 0,
  fontSize: '.6rem',
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
const StyledInputBase = experimentalStyled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    fontSize: '.7rem',
    fontWeight: 500,
    fontFamily: 'sofia-pro',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
    },
  },
}));
const StyledLink = experimentalStyled(Link)(() => ({
  color: Colors.COLOR_5,
  fontSize: '.7rem',
  paddingLeft: 15,
  paddingRight: 5,
  fontWeight: 600,
}));
const Navbar: FC<NavbarProps> = (props) => {
  const { setSearchText, closeSearch, searchText, isSearchOpen, openSearch } = useSearch();
  const { onSidebarMobileOpen, ...other } = props;
  const { resetNavBar, isNavBarVisible, isSearchBarVisible, isBackArrowVisible, title } = useNavigationStore((state) => (state));
  const titleIsVisible = !isSearchBarVisible && title;
  useEffect(() => {
    resetNavBar();
  }, []);

  const renderMenuIconIfNeeded = () => {
    if (isSearchOpen || titleIsVisible) { return null; }
    return (
      <IconButton
        sx={{ paddingRight: 0, color: 'black', display: { xs: 'block', lg: 'none' } }}
        aria-label='navigation menu'
        onClick={onSidebarMobileOpen}
      >
        <Menu fontSize='small' />
      </IconButton>
    );
  };
  const renderCancelSearchIfNeeded = () => {
    if (!isSearchOpen) return null;
    return <StyledLink href='#' onClick={closeSearch}>Cancel</StyledLink>;
  };

  const renderSearchIfNeeded = () => {
    if (!isSearchBarVisible) return null;
    return (
      <Search>
        <SearchIconWrapper>
          <SearchIcon fontSize='small' />
        </SearchIconWrapper>
        <StyledInputBase
          style={{ width: isSearchOpen ? '100%' : 'x' }}
          value={searchText}
          onClick={openSearch}
          onChange={(e) => { setSearchText(e.target.value); }}
          placeholder='Search'
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
    );
  };

  const renderTitleIfNeeded = () => {
    if (!titleIsVisible) return null;
    return (
      <Typography
        color='black'
        fontWeight='600'
        fontSize='1rem'
        variant='h1'
        textAlign='center'
        style={{ left: 0, pointerEvents: 'none', width: '100%', position: 'absolute' }}
      >
        {title}
      </Typography>
    );
  };

  const renderBackArrowIfNeeded = () => {
    if (!isBackArrowVisible) return null;
    return (
      <IconButton aria-label='back' color='primary' onClick={() => { window.history.back(); }}>
        <KeyboardBackspaceIcon />
      </IconButton>
    );
  };

  return (
    isNavBarVisible
      ? (
        <NavbarRoot {...other}>
          <Toolbar sx={{ minHeight: navbarHeight, paddingLeft: 0 }}>
            {renderBackArrowIfNeeded()}
            {renderMenuIconIfNeeded()}
            {renderSearchIfNeeded()}
            {renderTitleIfNeeded()}
            {renderCancelSearchIfNeeded()}
          </Toolbar>
        </NavbarRoot>
      ) : null
  );
};
Navbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func
};
export default Navbar;
