import { Grid, Button, Typography } from '@material-ui/core';

const DataTableHeader = (props) => {
    return (
        <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
                <Typography variant="h1">{props.headerText}</Typography>
            </Grid>
            <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' } }} />
            <Grid item md={2} xs={6}>
                <Button
                    onClick={props.onAdd}
                    variant="contained"
                    color="primary"
                    fullWidth>
                    {props.buttonText}
                </Button>
            </Grid>
        </Grid>
    );
};

export default DataTableHeader;
