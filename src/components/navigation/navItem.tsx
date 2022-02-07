import { FC, useState } from 'react';
import Link from 'next/link';
import { Box, Button, ListItem, makeStyles, Collapse, List, createStyles, Theme } from '@material-ui/core';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import PropTypes from 'prop-types';
import { Fragment } from 'react';

type NavItemProps = {
  active: boolean;
  icon?: string;
  path: string;
  title: string;
  children?: NavItemProps[];
  closeDrawer: () => void;
};

const useStyles = makeStyles({
  icon: {
    filter: 'invert(1)',
    height: 18,
    paddingLeft: 10,
    paddingRight: 10
  },
  nested: {
    paddingLeft: 20
  }
});

const NavItem: FC<NavItemProps> = (props) => {
  const { active, closeDrawer, icon, path, title, children } = props;
  const [ showChildren, setShowChildren ] = useState(true);
  const classes = useStyles();

  const hasChildren = children && children.length > 0;

  return (
    <Fragment>
      <ListItem
          disableGutters
          sx={{ display: 'flex', py: 0 }} >
          <Link
            href={path}>
            <Button
              onClick={() => { closeDrawer(); }}
              component={null}
              startIcon={icon ? <img alt={`icon for ${title}`} className={classes.icon} src={icon} /> : null}
              sx={{
                color: 'text.secondary',
                fontSize: 14,
                letterSpacing: 'normal',
                fontWeight: 600,
                justifyContent: 'flex-start',
                textAlign: 'left',
                pr: '8px',
                py: '12px',
                textTransform: 'none',
                width: '100%',
                '&:hover': {
                  color: 'white',
                  fontWeight: 'fontWeightBold',
                  backgroundColor: 'inherit'
                },
                ...(
                  active && {
                    color: 'white',
                    fontWeight: 'fontWeightBold',
                    '& svg': {
                      color: 'white'
                    }
                  }
                )
              }}
              variant='text'
              to={path}>
              <Box sx={{ flexGrow: 1 }}>
                {title}
              </Box>
            </Button>
          </Link>
          { hasChildren 
            && <div onClick={() => setShowChildren(!showChildren)}>
                {showChildren ? <ExpandLess /> : <ExpandMore />}
              </div>
          }
        </ListItem>
        <Collapse in={showChildren} timeout="auto" unmountOnExit>
          <List disablePadding>
            {hasChildren && children.map((child) => {
              const key = `${child.title}-${child.path}`;
              //const isActive = checkIfIsActive(pathname, child.path);

              return (
                <div className={classes.nested}>
                  <NavItem
                    key={key}
                    active={child.active}
                    closeDrawer={closeDrawer}
                    icon={child.icon}
                    path={child.path}
                    title={child.title}
                  />
                </div>
              );
            })}
          </List>
      </Collapse>
    </Fragment>
  );
};

NavItem.propTypes = {
  active: PropTypes.bool,
  closeDrawer: PropTypes.func.isRequired,
  icon: PropTypes.string,
  path: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default NavItem;
