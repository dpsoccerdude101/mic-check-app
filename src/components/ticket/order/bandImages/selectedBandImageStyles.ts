import { Colors } from 'src/constants';
import { NoImagePlaceholder } from 'src/constants/images';

const card: {
    width: number;
    height: number;
    selectedBorder: number;
    fontSize: number;
    iconSize: number;
    mobileMultiplier: number;
    borderRadius: string;
} = {
    width: 150,
    height: 93,
    selectedBorder: 4.16,
    fontSize: 12,
    iconSize: 14,
    mobileMultiplier: 0.8,
    borderRadius: '8%',
};

const SelectedBandImageStyles = {
    img: {
        position: 'relative',
        //backgroundImage: NoImagePlaceholder,
        width: '100%',
        height: '100%',
        borderRadius: card.borderRadius,
        filter: 'brightness(50%)',
    },
    wrapper: {
        maxWidth: card.width,
        padding: 0,
        cursor: 'pointer',
        borderRadius: card.borderRadius,
        transition: 'all 0.25s ease-out',
        ':hover': {
            backgroundColor: Colors.SECONDARY,
        },
    },
    bandCard: {
        maxWidth: card.width,
        position: 'relative',
        borderRadius: card.borderRadius,
        display: 'inline-grid',
        gridTemplateColumns: '1fr 3fr 1fr',
        gridTemplateRows: '1fr',
        placeItems: 'center',
        placeContent: 'center',
        overflow: 'hidden',
        backgroundColor: Colors.DARK_BACKDROP,
    },
    containerCard: {
        width: card.width,
        height: card.height,

        '@media (max-width: 365px)': {
            width: card.width * card.mobileMultiplier,
            height: card.height * card.mobileMultiplier,
        },

        gridColumn: '1 / -1',
    },
    checkMark: {
        fontSize: card.iconSize,
        color: Colors.TERTIARY,
        textAlign: 'center',
        transition: 'all 0.125s ease-out',
        '@media (max-width: 365px)': {
            fontSize: card.iconSize * card.mobileMultiplier,
        },
    },
    overlay: {
        fontFamily: 'soleil',
        fontSize: card.fontSize,
        textAlign: 'center',
        '@media (max-width: 365px)': {
            fontSize: card.fontSize * card.mobileMultiplier,
        },
    },
    overlayWrapper: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'white',
        gridColumn: '2 / span 1',
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        whiteSpace: 'nowrap',
    },
    checkMarkWrapper: {
        display: 'inline-flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        gridColumn: '3',
        height: '100%',
    },
    selectedCard: {
        transition: 'all 0.125s ease-out',
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: card.borderRadius,
        top: '0',
        left: '0',
    },
    selected: {
        boxShadow: `inset 0px 0px 0px ${card.selectedBorder}px ${Colors.TERTIARY}`,
        '@media (max-width: 365px)': {
            boxShadow: `inset 0px 0px 0px ${
                card.selectedBorder * card.mobileMultiplier
            }px ${Colors.TERTIARY}`, //90% solution
        },
    },
    checkMarkBackground: {
        width: 8.75,
        height: 7,
        position: 'absolute',
        left: 2.6,
        top: 42.5,
        background: 'white',
        zIndex: '-1',
        '@media (max-width: 365px)': {
            width: 8.5 * card.mobileMultiplier,
            height: 7 * card.mobileMultiplier,
            left: 3 * card.mobileMultiplier,
            top: 43.5 * card.mobileMultiplier,
        },
    },
} as const;

export default SelectedBandImageStyles;
