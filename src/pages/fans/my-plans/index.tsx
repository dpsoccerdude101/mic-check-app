import { Grid, Typography, makeStyles } from '@material-ui/core';
import { NextPageContext } from 'next';
import { MyPlanCard, NoResults, PageWrapper } from 'src/components';
import { ApiRoutes, UiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import type { BaseResponse, FanShowPlanDto } from 'src/types';
import { NoPlansPlaceholder } from 'src/constants/images';
import { useRouter } from 'next/router';

const useStyles = makeStyles({
    title: {
        paddingBottom: 10,
    },
});

type MyPlansProps = {
    items: FanShowPlanDto[];
};

const MyPlans = (props: MyPlansProps) => {
    const { items } = props;
    const router = useRouter();

    const classes = useStyles();

    const renderItems = () => {
        if (!items || items.length === 0) {
            return (
                <Grid item xs={12}>
                    <NoResults
                        title='No Current Plans'
                        subtitle={`You don't have any plans. Head over to Discover page and see what bands are playing in your area.`}
                        buttonText='Explore New Music'
                        buttonClick={() => router.push(UiRoutes.Fans.Discover)}
                        image={NoPlansPlaceholder} />
                </Grid>
            );
        }

        return items.map((item) => (
            <Grid key={item.showId} item xs={12}>
                <MyPlanCard model={item} />
            </Grid>
        ));
    };

    return (
        <PageWrapper title="Fan Shows">
            <Grid container spacing={2}>
                <Grid className={classes.title} item xs={12}>
                    <Typography variant="h1">My Plans</Typography>
                </Grid>
                {renderItems()}
            </Grid>
        </PageWrapper>
    );
};

export async function getServerSideProps(context: NextPageContext) {
    const response: BaseResponse<FanShowPlanDto[]> = await Api.get(
        ApiRoutes.Fans.GetMyPlanToGoShows,
        context
    );
    const { data, success } = response;
    if (success) {
        return { props: { items: data } };
    }
    return { props: { items: [] } };
}

export default MyPlans;
