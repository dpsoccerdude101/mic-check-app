/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, memo } from 'react';
import { Grid, Typography, useMediaQuery, Box } from '@material-ui/core';
import { NextPageContext } from 'next';
import { BandCardList, CustomSelect, PageWrapper } from 'src/components';
import { ApiRoutes } from 'src/constants';
import {
    BandCardModel,
    BaseResponse,
    ListResponse,
    MusicalGenre,
} from 'src/types';
import { Api } from 'src/utils';
import PagedAndSortedRequest from 'src/types/pagedAndSortedRequest';
import ShowBanner from 'src/components/showBanner';
import CustomSelectGenreTags from 'src/components/custom/customSelectGenreTags';
import { isEqual } from 'lodash';
import { Helper } from 'src/utils';
const { switchIndex } = Helper;

type DiscoverProps = {
    listResponse: ListResponse<BandCardModel>;
    musicalGenres: ListResponse<MusicalGenre>;
};

enum DiscoverSortBy {
    None = '',
    NumberOfFans = 'NUMBER_OF_FANS',
    Name = 'NAME',
}

const defaultGenre = {
    id: 0,
    name: 'All Genres',
} as MusicalGenre;

/**
 * To the next developer that reads this,
 * You are welcome to erase this code  and remove the function invocation
 * after the completion of SXSW 2022.
 */
const SXSWGenreModifier = (arr: MusicalGenre[]) => {
    const date = new Date();
    const SXSWIndex = arr.findIndex((genre) => genre.name === 'SXSW');
    // 03-21-2022 converted to milliseconds since the start of Unix Epoch Time Wed Dec 31 1969 19:00:00 GMT-0500
    if (date.valueOf() < 1647835200000 && SXSWIndex !== -1)
        return switchIndex(arr, SXSWIndex, 0);
    return arr;
};

const MemoizedBandCardList = memo(BandCardList);

const classes = {
    buttonRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '5vh',
    },
    title: {
        paddingBottom: '5px',
    },
    customSelect: {
        marginRight: { xs: '0px' },
    },
} as const;

const Discover = ({ listResponse, musicalGenres }: DiscoverProps) => {
    const [sortBy, setSortBy] = useState(DiscoverSortBy.None);
    const [items, setItems] = useState<BandCardModel[]>(
        listResponse.items ?? []
    );
    const [totalCount, setTotalCount] = useState(listResponse.totalCount ?? 0);
    const [genres, setGenres] = useState<MusicalGenre[]>(
        musicalGenres.items
            ? [defaultGenre, ...SXSWGenreModifier(musicalGenres.items)]
            : []
    );
    const [filterBy, setFilterBy] = useState<MusicalGenre[]>([defaultGenre]);
    const mdUp: boolean = useMediaQuery((theme: any) =>
        theme.breakpoints.up('md')
    );

    const handleSortByChange = async (value: DiscoverSortBy) =>
        value !== sortBy ? setSortBy(value) : null;

    /**
     * If value.length == 0, insert default genre
     * If forEach elem of genres === value, do nothing
     * else setFilterBy(value as MusicalGenre[])
     * @param value
     * @returns
     */
    const handleFilterByChange = async (value: MusicalGenre[]) =>
        value.length === 0
            ? setFilterBy([defaultGenre])
            : value.some((elem, index) => !isEqual(elem, filterBy[index]))
            ? setFilterBy(value)
            : null;

    const renderSortBy = () => (
        <CustomSelect
            styles={classes.customSelect}
            value={sortBy}
            handleChange={(value) => handleSortByChange(value)}
            options={[
                <option key={DiscoverSortBy.None} value={DiscoverSortBy.None}>
                    Relevance
                </option>,
                <option key={DiscoverSortBy.Name} value={DiscoverSortBy.Name}>
                    Name
                </option>,
                <option
                    key={DiscoverSortBy.NumberOfFans}
                    value={DiscoverSortBy.NumberOfFans}
                >
                    Number of fans
                </option>,
            ]}
        />
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const renderFiller = () => (
        <Grid sx={{ display: { xs: 'none', md: 'block' } }} item md={4} />
    );

    const renderSort = () => {
        //if (!mdUp) return null;
        return (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant='h2' sx={{ flexShrink: 0, mr: 2 }}>
                        Sort by
                    </Typography>
                    {renderSortBy()}
                </Box>
            </>
        );
    };

    const renderGenreFilter = () => {
        //if (!mdUp) return null;
        return (
            <Box
                sx={{
                    display: 'flex',
                    mr: { md: 'auto' },
                    justifyContent: { md: 'space-between' },
                    alignItems: 'center',
                }}
            >
                <Box sx={{ flexShrink: 0, mr: 2 }}>
                    <Typography variant='h2'>Filter by</Typography>
                    <Typography variant='subtitle1' sx={{ mt: '0' }}>
                        (Max 5)
                    </Typography>
                </Box>
                <CustomSelectGenreTags
                    initialGenres={genres}
                    values={filterBy}
                    handleChange={(value) => handleFilterByChange(value)}
                />
            </Box>
        );
    };

    const Filters = () => {
        return mdUp ? (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}
            >
                {renderGenreFilter()}
                {renderSort()}
            </Box>
        ) : (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {renderGenreFilter()}
                </Grid>
                <Grid item xs={12}>
                    {renderSort()}
                </Grid>
            </Grid>
        );
    };

    return (
        <PageWrapper title='Discover bands'>
            <Grid container maxWidth={'850px'} spacing={3}>
                <Grid sx={{ ...classes.title }} item xs={12}>
                    <Typography variant='h1'>Discover</Typography>
                    <Typography variant='subtitle1' mt={1}>
                        Explore new music, discover local artists, and see their
                        live shows in your area.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Filters />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Grid container maxWidth={'xl'} spacing={3}>
                        <MemoizedBandCardList
                            initialItems={items}
                            likedBands={false}
                            initialTotalCount={totalCount}
                            noItemsText='No bands left to discover'
                            sortBy={sortBy}
                            filterBy={filterBy}
                            listRoute={ApiRoutes.Fans.ListDiscoverBands}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <ShowBanner />
        </PageWrapper>
    );
};

export async function getServerSideProps(context: NextPageContext) {
    const request: PagedAndSortedRequest = {
        maxResultCount: 4,
        skipCount: 0,
        sorting: '',
    };
    const response: BaseResponse<ListResponse<BandCardModel>> = await Api.get(
        ApiRoutes.Fans.ListDiscoverBands(request),
        context
    );
    const { data, success } = response;
    if (success) {
        const genreListResponse: BaseResponse<ListResponse<MusicalGenre>> =
            await Api.get(ApiRoutes.MusicalGenre.GetAll, context);
        const { data: genreListData, success: genreListSuccess } =
            genreListResponse;
        if (genreListSuccess)
            return {
                props: { listResponse: data, musicalGenres: genreListData },
            };

        return {
            props: { listResponse: data, musicalGenres: { totalCount: 0 } },
        };
    }
    return {
        props: {
            listResponse: { totalCount: 0 },
            musicalGenres: { totalCount: 0 },
        },
    };
}

export default Discover;
