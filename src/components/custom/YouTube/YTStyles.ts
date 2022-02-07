import { SystemStyleObject } from '@material-ui/system';
import { Colors } from 'src/constants';

const YTStyles = {
    root: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    button: {
        marginTop: '10px',
        fontSize: 12,
        fontWeight: 400,
        height: 45,
        width: '120px',
    },
    dashedBorder: {
        border: '1px dashed',
        borderRadius: '8px',
        borderColor: 'gray',
    },
    grayBg: {
        backgroundColor: 'rgba(228,228,228,0.25)',
    },
    video: {
        borderRadius: 5,
        height: '23vh',
    },
    youtubeVideo: {
        borderRadius: 5,
        height: '23vh',
        width: '45vh',
    },
    videoRoot: {
        alignItems: 'center',
        display: 'block',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    middle: {
        transition: '.25s ease',
        opacity: 0,
        position: 'absolute',
        textAlign: 'center',
    },
    p: {
        fontSize: 15,
        fontWeight: 600,
        marginBottom: '10px',
    },
    text: {
        color: Colors.PRIMARY,
        fontSize: 16,
    },
    wrapper: {
        align: 'center',
    },
} as const;

export default YTStyles;
