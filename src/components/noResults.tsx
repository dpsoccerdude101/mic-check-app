import { Button, makeStyles, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Image from 'next/image';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        height: '400px',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    subtitle: {
        width: '280px',
        textAlign: 'center',
        margin: '18px 0 25px',
        lineHeight: '1.5',

        [theme.breakpoints.up('sm')]: {
            width: '43ch',
        },
    },
}));

export const NoResults = ({ title, subtitle, buttonText, buttonClick, image }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Image width='200' height='200'  src={image} />
            <Typography variant='h2'>{title}</Typography>
            <Typography variant='body2' className={classes.subtitle}>
                {subtitle}
            </Typography>
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    buttonClick();
                }}
                variant='contained'
                startIcon={<SearchIcon fontSize='small' />}
                size='medium'
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default NoResults;
