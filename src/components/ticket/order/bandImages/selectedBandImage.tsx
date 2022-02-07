import { ShowBandDto } from 'src/types';
import { Box, ListItem, Card, Typography } from '@material-ui/core';
import Image from 'next/image';
import { ListItemButton } from '@mui/material';
import { NoImagePlaceholder } from 'src/constants/images';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import classes from './selectedBandImageStyles';
import CustomImage from 'src/components/custom/customImage';

type SupportedBandProps = {
    band: ShowBandDto['band'];
    bandId: ShowBandDto['band']['id'];
    selected: boolean;
    handleChange: (event: any, value: any) => void;
};

const SelectedBandImage = ({
    band,
    bandId,
    selected,
    handleChange,
}: SupportedBandProps) => {
    return (
        <ListItem
            key={bandId}
            value={bandId}
            sx={{ flexGrow: 0, width: 'auto' }}
        >
            <ListItemButton
                sx={{ ...classes.wrapper }}
                role={undefined}
                selected={selected}
                onClick={(e) => handleChange(e, bandId)}
                dense
            >
                <Card sx={{ ...classes.bandCard }}>
                    <Box sx={{ ...classes.containerCard }}>
                        <Box sx={{ ...classes.img }}>
                            <Image
                                layout="fill"
                                objectFit="cover"
                                src={
                                    band.profilePictureId
                                        ? `https://api.themiccheck.com/api/app/files/file/${band.profilePictureId}`
                                        : NoImagePlaceholder
                                }
                                title={band.name}
                                alt={band.name}
                            />
                        </Box>
                        <Box
                            /**
                             * This is the blue ring around the selected image.
                             */
                            sx={{
                                ...classes.selectedCard,
                                ...(selected && classes.selected),
                            }}
                        ></Box>
                    </Box>
                    <Box sx={{ ...classes.overlayWrapper }}>
                        <Typography
                            variant="caption"
                            id={bandId}
                            sx={{ ...classes.overlay }}
                        >
                            {/* Maximum 18 Character Count */}

                            {band.name.length > 13
                                ? band.name.substring(0, 10).concat('...')
                                : band.name}
                        </Typography>
                    </Box>

                    <Box sx={{ ...classes.checkMarkWrapper }}>
                        <Box
                            sx={{
                                ...(selected && classes.checkMarkBackground),
                            }}
                        ></Box>
                        {selected && (
                            <CheckCircleIcon
                                id={bandId}
                                sx={{ ...classes.checkMark }}
                            />
                        )}
                    </Box>
                </Card>
            </ListItemButton>
        </ListItem>
    );
};
export default SelectedBandImage;
