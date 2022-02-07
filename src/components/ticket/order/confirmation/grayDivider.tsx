import { Box, Divider, makeStyles } from '@material-ui/core';

import { Colors } from 'src/constants';

const useStyles = makeStyles((theme) => ({
    divider: {
        width: '100%',
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        color: Colors.COLOR_5,
    },
}));

const GrayDivider = (props) => {
    const classes = useStyles();
    return (
        <Box {...props}>
            <Divider className={classes.divider} />
        </Box>
    );
};

export default GrayDivider;
