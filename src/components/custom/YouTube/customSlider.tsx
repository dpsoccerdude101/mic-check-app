import {
    Button,
    Grid,
    Typography,
    TextField,
    IconButton,
    Slider,
    Box,
    CircularProgress,
    SliderThumb,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import BandYTVideo from 'src/types/band/bandYTVideo';

type Props = {
    bandYTVideo: BandYTVideo;
    setYouTubeVideoStartTime: (val: number) => void;
    duration: number;
    maxSeconds: number;
    setDoneTrimming: (val: boolean) => void;
};

const CustomSlider = ({
    bandYTVideo,
    setYouTubeVideoStartTime,
    duration,
    maxSeconds,
    setDoneTrimming,
}: Props) => {
    const TrimThumb = (props) => {
        const { children, ...other } = props;
        return (
            <SliderThumb
                sx={{
                    height: 27,
                    width: `${(maxSeconds * 100) / duration}%`,
                    /* backgroundColor: 'transparent', */
                    /*    backgroundColor: '#fff', */
                }}
                {...other}
            >
                {children}
                <Box
                    component="span"
                    sx={{
                        height: 15,
                        width: 1,
                        backgroundColor: 'black',
                        marginLeft: 0,
                        marginRight: 'auto',
                    }}
                    className="left-bar"
                />

                <Box
                    component="span"
                    sx={{
                        height: 15,
                        width: 1,
                        backgroundColor: 'black',
                    }}
                    className="right-bar"
                />
            </SliderThumb>
        );
    };

    TrimThumb.propTypes = {
        children: PropTypes.node,
    };

    const handleChange = (e, value: number): void => {
        const tempVal =
            value > duration - maxSeconds ? duration - maxSeconds : value;
        setYouTubeVideoStartTime(tempVal);
    };
    return (
        <>
            <Slider
                sx={{
                    margin: '20px 0px',
                    height: 3,
                    '& .MuiSlider-track': {
                        height: 3,
                    },
                }}
                track={false}
                getAriaLabel={() => 'Length of Video'}
                components={{ Thumb: TrimThumb }}
                valueLabelDisplay="on"
                //midpoint
                value={bandYTVideo.startTime}
                onChange={handleChange}
                //defaultValue={0}
                // getAriaValueText={valuetext}
                //valueLabelDisplay="auto"
                min={0}
                max={duration !== 0 ? duration - maxSeconds : 100}
            />
        </>
    );
};

export default CustomSlider;
