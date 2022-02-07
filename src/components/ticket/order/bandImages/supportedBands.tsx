/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTicketInstanceStore } from 'src/stores';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { Helper } from 'src/utils';
import {
    Box,
    Typography,
    makeStyles,
    useTheme,
    List,
    Grid,
    CircularProgress,
} from '@material-ui/core';
import { ListItemButton } from '@mui/material';
import showsService from 'src/services/showsService';
import {
    ShowBandDto,
    BaseResponse,
    Show,
    ListResponse,
    ShowsQueryRequest,
    Band,
} from 'src/types';
import { ApiRoutes, Colors } from 'src/constants';
import { Api } from 'src/utils';
import SelectedBandImage from './selectedBandImage';

const useStyles = makeStyles({
    list: {
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 167px)',
        justifyContent: 'space-around',
        '@media (max-width: 365px)': {
            gridTemplateColumns: 'repeat(auto-fill, 133.6px)', //167 * 0.800
        },
        /* flexWrap: 'wrap', */
    },
    'list > *:last-child': {
        marginRight: 'auto',
    },
});
const { asyncForEach } = Helper;

const SupportedBands = () => {
    const theme = useTheme();
    const classes = useStyles();
    const { clear, itemsCount, show, sourceBandId, setSupportedShowBandIds } =
        useTicketInstanceStore((state) => ({
            clear: state.clearOrder,
            itemsCount: state.orderItems.length,
            show: state.show,
            sourceBandId: state.sourceBandId,
            setSupportedShowBandIds: state.setSupportedShowBandIds,
        }));

    const [showBands, setShowBands] = useState<ShowBandDto[]>([]);
    const [supportedShowBands, setSupportedShowBands] = useState<ShowBandDto[]>(
        []
    );
    const [showBandsLoading, setShowBandsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchShow = async () => {
            const response = await showsService.getById(show.id);
            const tempShowBands = response.data.bands;

            const getBandPictures = async () => {
                await asyncForEach(
                    tempShowBands,
                    async (showBand: ShowBandDto) => {
                        const { bandId } = showBand;
                        const response: BaseResponse<Band> = await Api.get(
                            ApiRoutes.Bands.Get(bandId)
                        );
                        const { data, success } = response;
                        if (success) {
                            const { profilePictureId } = data;
                            /**
                             * This sets the showBand state. On hot reloads, this will keep on concateninating
                             * showbands as it does not check for duplicates.
                             *
                             * If such a solution is required in the future, then it may be developed using Array.slice()
                             * and the index and array args from the asyncForEach callback function.
                             */
                            setShowBands((prevState) => [
                                ...prevState,
                                {
                                    ...showBand,
                                    band: {
                                        ...showBand.band,
                                        profilePictureId: profilePictureId,
                                    },
                                },
                            ]);
                        }
                    }
                );
            };
            getBandPictures().then(() => setShowBandsLoading(false));
        };
        fetchShow();
    }, []);

    /**
     * Set initial supportedShow to be the sourceShowBand.
     */
    useEffect(() => {
        if (Array.isArray(showBands) && showBands.length > 0) {
            const sourceShowBands = showBands.filter(
                (showBand) => showBand.bandId === sourceBandId
            );
            if (sourceShowBands.length > 0) {
                const sourceShowBand = sourceShowBands[0];
                setSupportedShowBands([sourceShowBand]);
                setSupportedShowBandIds([sourceShowBand.id]);
                console.log('fetchShow: sourceShowBand', sourceShowBand);
            }
        }
    }, [showBands]);

    const handleChange = (event, value) => {
        console.dir(event.target);
        console.log('Selection: ', value);
        let selectedShowBands: ShowBandDto[] = [];

        /**
         * Check if band with id of value is in supportedShowBands.
         * Essentially, this is a toggle feature.
         */

        console.dir(supportedShowBands);
        const foundSupportedShowBand = supportedShowBands.find(
            (supportedShowBand) => supportedShowBand.bandId === value
        );

        /**
         * If true, remove band with id of value from supportedShowBands.
         */
        if (foundSupportedShowBand)
            selectedShowBands = supportedShowBands.filter(
                (supportedShowBand) =>
                    !isEqual(supportedShowBand, foundSupportedShowBand)
            );
        /**
         * Else, add band with id of value to supportedShowBands.
         */ else {
            console.log('showbands \n');
            console.dir(showBands);
            selectedShowBands = [
                ...supportedShowBands,
                showBands.find((showBand) => showBand.bandId === value),
            ];
        }
        const selectedShowBandIds = selectedShowBands.map(
            (selectedShowBand) => selectedShowBand.id
        );

        console.log('value', value);
        console.log('selectedShowBands \n');
        console.dir(selectedShowBands);
        setSupportedShowBands(selectedShowBands);
        setSupportedShowBandIds(selectedShowBandIds);
    };

    return (
        <>
            <Box
                display='flex'
                flexDirection='column'
                flexGrow={1}
                padding={2}
                width='100%'
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Typography variant='h3' component='h3' mb={1}>
                            Which artist(s) are you interested in seeing?
                        </Typography>
                        <Typography variant='body1'>
                            This information helps support your favorite
                            artist(s)
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        {showBands && (
                            <List className={classes.list}>
                                {showBandsLoading ? (
                                    <CircularProgress />
                                ) : (
                                    showBands.map(({ band, bandId }) => (
                                        <SelectedBandImage
                                            key={bandId}
                                            band={band}
                                            bandId={bandId}
                                            selected={supportedShowBands.some(
                                                (supportedShowBand) =>
                                                    supportedShowBand &&
                                                    supportedShowBand.bandId ===
                                                        bandId
                                            )}
                                            handleChange={handleChange}
                                        />
                                    ))
                                )}
                            </List>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default SupportedBands;
