import { useState } from 'react';
import { Button, Link, makeStyles } from '@material-ui/core';
import { Download } from '@material-ui/icons';

const useStyles = makeStyles({
    hover: {
        transition: '.25s ease',
        opacity: 0,
        position: 'absolute',
        textAlign: 'center',
    },
    wrapper: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

type ImageDownloadProps = {
    downloadUrl: string;
    imgSrc: string;
    title: string;
    imgProps?: any;
};
const ImageDownload = ({
    downloadUrl,
    imgSrc,
    title,
    imgProps,
}: ImageDownloadProps) => {
    const classes = useStyles();
    const [isHover, setHover] = useState(false);

    return (
        <div
            className={classes.wrapper}
            onFocus={() => {}}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            onBlur={() => {}}
        >
            <img
                height={300}
                width={300}
                src={imgSrc}
                alt={title}
                title={title}
                style={{ opacity: isHover ? '0.3' : 1 }}
                {...imgProps}
            />
            <div className={classes.hover} style={{ opacity: isHover ? 1 : 0 }}>
                <Link href={downloadUrl} target="_blank">
                    <Button
                        component="label"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<Download />}
                    >
                        Download
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default ImageDownload;
