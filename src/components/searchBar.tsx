import { IconButton, Input, InputBase, makeStyles } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import { Colors } from 'src/constants';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { useCallback, useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
    input: {
        width: '100%',
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
    },
    iconButton: {
      color: theme.palette.action.active,
      transform: "scale(1, 1)",
      transition: theme.transitions.create(["transform", "color"], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeInOut
      })
    },
    hiddenIcon: {
      transform: "scale(0, 0)",
      "& > $icon": {
        opacity: 0,
      }
    },
    icon: {
      transition: theme.transitions.create(["opacity"], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeInOut
      })
    }
}));

const Search = experimentalStyled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: Colors.SECONDARY,
    fontSize: '.8rem',
    fontFamily: 'sofia-pro',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(1, 0),
    [theme.breakpoints.up('sm')]: {
        width: '26%',
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
const CloseIconWrapper = experimentalStyled(IconButton)(({ theme }) => ({
    color: Colors.COLOR_5,
    padding: theme.spacing(1),
    marginLeft: '20%',
    fontSize: '.6rem',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    [theme.breakpoints.up('sm')]: {
        marginLeft: '-20%',
    },
}));

const SearchBar = ({
    disabled,
    onCloseSearch,
    cancelOnEscape,
    ...inputProps
}) => {
    const classes = useStyles();
    const [value, setValue] = useState(inputProps.value);

    useEffect(() => {
        setValue(inputProps.value);
    }, [inputProps.value]);

    const handleChange = useCallback(
        (e) => {
            setValue(e.target.value);
            if (inputProps.onChange) {
                inputProps.onChange(e.target.value);
            }
        },
        [inputProps.onChange]
    );

    const handleCloseSearch = useCallback(() => {
        setValue('');
        if (onCloseSearch) {
            onCloseSearch();
        }
    }, [onCloseSearch]);

    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon fontSize="small" />
            </SearchIconWrapper>
            <InputBase
                {...inputProps}
                value={value}
                className={classes.input}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'search' }}
            />
            <CloseIconWrapper
              className={value === "" ? classes.hiddenIcon : classes.iconButton}
              onClick={handleCloseSearch}>
                <ClearIcon className={classes.icon} fontSize="small" />
            </CloseIconWrapper>
        </Search>
    );
};

export default SearchBar;
