import { useEffect, useState, memo } from 'react';
import useDidMountEffect from 'src/hooks/useDidMountEffect';
import {
    BandCardModel,
    BaseResponse,
    ListResponse,
    MusicalGenre,
    PagedAndSortedRequest,
} from 'src/types';
import { Box, Grid, Typography, GridSize } from '@material-ui/core';
import { Api } from 'src/utils';
import { CustomLoader } from 'src/components';
import { layoutContainerId } from 'src/constants/appConstants';
import BandCard from 'src/components/bands/card/bandCard';

const MemoizedBandCard = memo(BandCard);

type BandCardListProps = {
    initialItems: BandCardModel[];
    initialTotalCount: number;
    noItemsText: string;
    likedBands: boolean;
    listRoute: (request: any) => string;
    sortBy?: string;
    filterBy?: MusicalGenre[];
};

/**
 * returns array of musical genres with default genre of 'All Genres' omitted
 * @param musicalGenres
 * @returns musicalGenre[]
 */
const removeDefaultGenre = (musicalGenres: MusicalGenre[]) =>
    musicalGenres.filter((genre) => genre.id !== 0);

const BandCardList = ({
    noItemsText,
    initialItems,
    initialTotalCount,
    listRoute,
    sortBy,
    filterBy,
    likedBands,
}: BandCardListProps) => {
    const [items, setItems] = useState<BandCardModel[]>(initialItems ?? []);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(initialTotalCount ?? 0);
    const OFFSET = likedBands ? 6 : 4;

    const getGenreIds = () =>
        filterBy ? removeDefaultGenre(filterBy).map((genre) => genre.id) : [];

    useDidMountEffect(() => {
        const reloadItems = async () => {
            setLoading(true);
            const request: PagedAndSortedRequest = {
                maxResultCount: OFFSET,
                skipCount: 0,
                sorting: sortBy,
                GenreIds: getGenreIds(),
            };
            const response: BaseResponse<ListResponse<BandCardModel>> =
                await Api.get(listRoute(request));
            const { data, success } = response;
            if (success) {
                setItems(data.items);
                setTotalCount(data.totalCount);
            }
            setLoading(false);
        };
        reloadItems();
    }, [sortBy, filterBy]);

    const appendItems = async (maxCount: number, previousCount: number) => {
        setLoading(true);
        const request: PagedAndSortedRequest = {
            maxResultCount: maxCount,
            skipCount: 0,
            sorting: sortBy,
            GenreIds: getGenreIds(),
        };
        const response: BaseResponse<ListResponse<BandCardModel>> =
            await Api.get(listRoute(request));
        const { data, success } = response;
        if (success) {
            setItems([...items, ...data.items.slice(previousCount)]);
            setTotalCount(data.totalCount);
        }
        setLoading(false);
    };

    const handleScroll = async () => {
        const element = document.getElementById('hiddenButton');
        if (!element) return;
        const position = element.getBoundingClientRect();
        const isAtBottom =
            position.top < window.innerHeight + 1 && position.bottom >= 0;
        if (isAtBottom && !loading) {
            appendItems(items.length + OFFSET, items.length);
        }
    };

    useEffect(() => {
        document
            .getElementById(layoutContainerId)
            .addEventListener('scroll', handleScroll);
        return () => {
            document
                .getElementById(layoutContainerId)
                .removeEventListener('scroll', handleScroll);
        };
        // IMPORTANT: Need to add all variables that'll be checked inside handleScroll because it's a different scope
        // In this case -> items.length and loading
    }, [items, loading]);

    const columnProps = {
        xs: 12 as GridSize,
        md: likedBands ? (4 as GridSize) : (6 as GridSize),
        lg: likedBands ? (4 as GridSize) : (6 as GridSize),
    };

    const renderItems = () =>
        items.map((el) => (
            <Grid item key={el.id} {...columnProps}>
                <MemoizedBandCard key={el.id} model={el} />
            </Grid>
        ));
    const renderBottomItem = () =>
        totalCount > OFFSET &&
        items.length < totalCount && (
            <Grid item xs={12}>
                {loading && (
                    <Box
                        mb={2}
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                    >
                        <CustomLoader paddingTop='10px' />
                    </Box>
                )}
                <div id='hiddenButton' />
            </Grid>
        );

    return (
        <>
            {totalCount === 0 ? (
                <Typography variant='body2'>{noItemsText}</Typography>
            ) : (
                renderItems()
            )}
            {renderBottomItem()}
        </>
    );
};

export default BandCardList;
