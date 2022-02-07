import { useState, ReactNode } from 'react';
import { IconButton, Menu, MenuItem, Typography, makeStyles } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export type MoreIconMenuItemProps = {
  handleClick: () => Promise<void>;
  Icon: ReactNode;
  title: string;
};

export type MoreIconMenuProps = {
  cssClass?: string,
  items: MoreIconMenuItemProps[];
};

const MoreIconMenu = ({ cssClass = '', items }: MoreIconMenuProps) => {
  const classes = useStyles();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const open = Boolean(menuAnchor);

  const moreIconMenuItem = ({ handleClick, Icon, title }: MoreIconMenuItemProps) => (
    <MenuItem
      key={uuidv4()}
      onClick={() => {
        handleClick();
        setMenuAnchor(null);
      }}
    >
      {Icon}
      <Typography style={{ paddingLeft: 5 }} variant='body2'>
        {title}
      </Typography>
    </MenuItem>
  );

  return (
    <div className={classes.root}>
      <IconButton className={cssClass} onClick={(e) => setMenuAnchor(e.currentTarget)} aria-label='more' aria-controls='shows-menu' aria-haspopup='true'>
        <MoreHoriz />
      </IconButton>
      <Menu
        id='shows-menu'
        anchorEl={menuAnchor}
        open={open}
        onClose={() => setMenuAnchor(null)}
      >
        {
          items.map((el) => {
            const { handleClick, title, Icon } = el;
            return moreIconMenuItem({ handleClick, title, Icon });
          })
        }
      </Menu>
    </div>
  );
};
export default MoreIconMenu;
