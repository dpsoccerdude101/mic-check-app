/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ReactNode, memo } from 'react';
import { ListResponse, BandCardModel, BaseResponse } from 'src/types';
import { NextPageContext } from 'next';
import { ApiRoutes } from 'src/constants';
import { BandCardList, PageWrapper } from 'src/components';
import { Grid, Typography } from '@material-ui/core';
import { Api } from 'src/utils';
import PagedAndSortedRequest from 'src/types/pagedAndSortedRequest';
const MemoizedBandCardList = memo(BandCardList);

type LikedBandsProps = {
    listResponse: ListResponse<BandCardModel>;
};

const LikedBands = ({ listResponse }: LikedBandsProps) => (
    <PageWrapper title='Liked bands'>
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant='h1'>Liked Bands</Typography>
            </Grid>
            <MemoizedBandCardList
                initialItems={listResponse.items ?? ([] as BandCardModel[])}
                initialTotalCount={listResponse.totalCount ?? 0}
                likedBands={true}
                noItemsText='No liked bands.'
                sortBy={null}
                listRoute={ApiRoutes.Fans.ListLikedBands}
            />
        </Grid>
    </PageWrapper>
);
export async function getServerSideProps(context: NextPageContext) {
    const request: PagedAndSortedRequest = {
        maxResultCount: 6,
        skipCount: 0,
        sorting: '',
    };

    const response: BaseResponse<ListResponse<BandCardModel>> = await Api.get(
        ApiRoutes.Fans.ListLikedBands(request),
        context
    );
    const { data, success } = response;
    if (success) return { props: { listResponse: data } };
    return { props: { listResponse: { totalCount: 0 } } };
}

export default LikedBands;
