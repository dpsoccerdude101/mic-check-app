import { useEffect, useState } from 'react';
import {
    BaseForm,
    CustomHookFormTextField,
    CustomFileUpload,
    CustomLabel,
    ImageDownload,
} from 'src/components';
import { useBand } from 'src/hooks';
import { ApiRoutes, Colors, Messages } from 'src/constants';
import {
    City,
    Band,
    BaseResponse,
    FileModel,
    FormFieldValidationProps,
    IdRequest,
    MusicalGenre,
} from 'src/types';
import {
    Chip,
    MenuItem,
    Grid,
    FormControl,
    Select,
    makeStyles,
} from '@material-ui/core';
import { LocationCity } from '@material-ui/icons';
import { Api } from 'src/utils';
import * as Yup from 'yup';
import {
    useBandGeneral,
    useBandVideos,
    useBandYTVideos,
} from 'src/hooks/useBand';

import CustomAutocomplete from 'src/components/custom/customAutocomplete';
import BandYTVideo from 'src/types/band/bandYTVideo';

const initialValue: Band = {
    id: '',
    name: '',
    description: '',
    hometown: '',
};
const requiredMessage = Messages.Forms.FieldRequired;
const validationSchema = Yup.object().shape({
    name: Yup.string().max(150).required(requiredMessage('name')),
});

const useStyles = makeStyles((theme) => ({
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        background: Colors.TERTIARY,
        borderRadius: 5,
        color: 'white',
        fontFamily: 'acumin-pro',
        fontWeight: 300,
        margin: 2,
    },
    genreSelect: {
        background: Colors.QUATERNARY,
    },
    uploadGrid: {
        [theme.breakpoints.down('lg')]: {
            height: 150,
        },
    },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const GeneralTab = () => {
    const classes = useStyles();
    const { setVideos } = useBandVideos();
    const { setYTVideos } = useBandYTVideos();
    const [genreOptions, setGenreOptions] = useState<MusicalGenre[]>([]);
    const [bandGenres, setBandGenres] = useState<string[]>([]);
    const [qrCodeSrc, setQRCode] = useState(null);
    // Image loaded from memory
    const [fileModel, setFileModel] = useState<FileModel>(null);
    const [city, setCity] = useState<City>(null);
    const { band } = useBand();
    const {
        setHometown,
        setName,
        setDescription,
        setSelectedGenreTags,
        setProfilePicture,
    } = useBandGeneral();
    const {
        name,
        hometown,
        description,
        selectedGenreTags: genreTags,
        profilePicture,
    } = useBandGeneral();

    const renderGenreTags = () => (
        <FormControl variant="outlined">
            <Select
                id="musical-genre-select"
                multiple
                className={classes.genreSelect}
                value={bandGenres}
                onChange={(e) => {
                    let newValues = e.target.value as string[];
                    if (newValues.length > 5) {
                        newValues = newValues.slice(1, 6);
                    }
                    setSelectedGenreTags(newValues);
                    setBandGenres(newValues);
                }}
                renderValue={(selected) => (
                    <div className={classes.chips}>
                        {(selected as string[]).map((value) => (
                            <Chip
                                key={value}
                                label={value}
                                className={classes.chip}
                            />
                        ))}
                    </div>
                )}
                MenuProps={MenuProps}
            >
                {genreOptions.map((genre) => {
                    const { id } = genre;
                    return (
                        <MenuItem key={id} value={genre.name}>
                            {genre.name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );

    const setPicture = (model: FileModel) => {
        setFileModel(model);
        setProfilePicture(model);
    };

    useEffect(() => {
        const loadGenres = async () => {
            const response: BaseResponse<any> = await Api.get(
                ApiRoutes.MusicalGenre.GetAll
            );
            const { data, success } = response;
            if (success) {
                setGenreOptions(data.items as MusicalGenre[]);
            }
            // Check if has genreTags on bandGeneralContext
            if (genreTags) {
                setBandGenres(genreTags);
            } else if (band.genreTags) {
                setSelectedGenreTags(band.genreTags.map((el) => el.name));
                setBandGenres(band.genreTags.map((el) => el.name));
            }
        };

        const loadPicture = async () => {
            // Check if has profile on bandGeneralContext
            if (profilePicture) {
                setFileModel(profilePicture);
            } else if (!profilePicture && band.profilePictureId) {
                // Load srcString from api
                const newFileModel: FileModel = {
                    srcString: ApiRoutes.Files.GetFile(band.profilePictureId),
                    content: null,
                    name: '',
                    size: 0,
                    contentType: '',
                };
                setPicture(newFileModel);
            }
        };

        const loadVideos = async () => {
            setVideos(band.medias);
        };

        const loadYTVideos = async () => {
            const ytResponse: BaseResponse<BandYTVideo[]> = await Api.get(
                ApiRoutes.YouTubeVideos.GetAllBandVideos(band.id)
            );
            const { data, success } = ytResponse;

            if (success) setYTVideos(data);
            //setYTVideos(band.ytVideos);
        };

        const loadGeneralProperties = () => {
            if (band) {
                const updatedName = name ?? band.name;
                const updatedHometown = hometown ?? band.hometown;
                const updatedDescription = description ?? band.description;

                if (updatedHometown) {
                    const split = updatedHometown.split(',');
                    const tempCity: City = {
                        city: split[0],
                        state: split[1],
                        principal: updatedHometown,
                    };
                    setCity(tempCity);
                }

                initialValue.name = updatedName;
                initialValue.description = updatedDescription;
                initialValue.hometown = updatedHometown;

                setName(updatedName);
                setDescription(updatedDescription);
                setHometown(updatedHometown);
            }
        };

        const loadQRCode = async () => {
            let { qrcodeFileId } = band;
            if (!qrcodeFileId) {
                const { id } = band;
                const request: IdRequest = { id };
                const response: BaseResponse<string> = await Api.post(
                    ApiRoutes.Bands.GenerateQRCode,
                    request
                );
                const { data, success } = response;
                if (success) {
                    qrcodeFileId = data;
                }
            }
            const source = ApiRoutes.Files.GetFile(qrcodeFileId);
            setQRCode(source);
        };

        loadVideos();
        loadYTVideos();
        loadPicture();
        loadQRCode();
        loadGenres();
        loadGeneralProperties();
    }, []);

    const formatCity = (value: City): string => {
        if (!value) return '';

        let formatted: string = '';
        const { state } = value;
        const addrCity = value.city;
        if (addrCity) {
            formatted = `${addrCity.trim()}`;
        }

        if (state) {
            formatted += `, ${state.trim()}`;
        }

        return formatted;
    };

    const imageData =
        fileModel && fileModel.srcString ? fileModel.srcString : null;

    const renderQRCode = () => {
        if (!qrCodeSrc) {
            return null;
        }
        return (
            <ImageDownload
                imgSrc={qrCodeSrc}
                title={`${name} QRCode`}
                downloadUrl={qrCodeSrc}
            />
        );
    };

    return (
        <BaseForm
            submitFunc={async (values) => {
                console.log(values);
            }}
            initialValue={initialValue}
            validationSchema={validationSchema}
        >
            {(validationProps: FormFieldValidationProps) => (
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    alignItems="stretch"
                >
                    <Grid item xs={12} md={4} className={classes.uploadGrid}>
                        <Grid style={{ height: '100%' }}>
                            <CustomFileUpload
                                imgSrc={imageData}
                                label="Profile Picture"
                                setFileModel={setPicture}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        sx={{ display: { xs: 'block', md: 'none' } }}
                        md={12}
                    >
                        {renderQRCode()}
                    </Grid>
                    <Grid item md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomLabel title="Band Name" />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomHookFormTextField
                                    {...validationProps}
                                    updateValue={setName}
                                    name="name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomLabel title="Hometown" />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomAutocomplete<City>
                                    Icon={LocationCity}
                                    descriptionLabel="country"
                                    value={city}
                                    setValue={(selected: City) => {
                                        setCity(selected);
                                        const hometownString = `${selected.city}, ${selected.state}`;
                                        setHometown(hometownString);
                                    }}
                                    formatValue={formatCity}
                                    optionLabel="principal"
                                    primaryLabel="principal"
                                    routeFunction={ApiRoutes.Address.GetCity}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        sx={{ display: { xs: 'none', md: 'block' } }}
                        md={4}
                    >
                        {renderQRCode()}
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomLabel title="Bio ( Max. 500 Characters )" />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomHookFormTextField
                                    {...validationProps}
                                    name="description"
                                    extraProps={{
                                        multiline: true,
                                        rows: 4,
                                        inputProps: { maxLength: 500 },
                                    }}
                                    updateValue={setDescription}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomLabel title="Genre Tags ( Max. 5 )" />
                            </Grid>
                            <Grid item xs={12}>
                                {renderGenreTags()}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </BaseForm>
    );
};

export default GeneralTab;
