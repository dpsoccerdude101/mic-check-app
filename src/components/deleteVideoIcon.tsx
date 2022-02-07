/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useDialog } from 'src/hooks';
import { useBandVideos } from 'src/hooks/useBand';
import { useBandYTVideos } from 'src/hooks/useBand';
import { useSnackbar } from 'notistack';
import { ApiRoutes } from 'src/constants';
import { Api } from 'src/utils';
import type { BaseResponse, SetDialogProps } from 'src/types';

const useStyles = makeStyles({
    iconWrapper: {
        cursor: 'pointer',
        display: 'flex',
        position: 'absolute',
        top: '.5rem',
        right: '.5rem',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: 'white',
    },
});

type DeleteVideoIconProps = {
    mediaId: number | string;
    isYTVideo?: boolean;
};

/**
 * YTVideo deletes give a string ID while non-YT video deletes give a number ID
 * @param param0
 * @returns
 */
const DeleteVideoIcon = ({
    mediaId,
    isYTVideo = false,
}: DeleteVideoIconProps) => {
    const classes = useStyles();
    const [hover, setHover] = useState(false);
    const { showDialog } = useDialog();
    const { enqueueSnackbar } = useSnackbar();
    const { videos, setVideos } = useBandVideos();
    const { ytVideos, setYTVideos } = useBandYTVideos();

    const submitYTVideoDelete = async (id: string) => {
        const deleteResponse: BaseResponse = await Api.delete(
            ApiRoutes.YouTubeVideos.DeleteYTVideo(id)
        );
        const { message, success } = deleteResponse;
        success
            ? setYTVideos(ytVideos.filter((elem) => elem.id !== id))
            : enqueueSnackbar(message, { variant: 'error' });
    };
    const submitVideoDelete = async (id: number) => {
        const deleteResponse: BaseResponse = await Api.delete(
            ApiRoutes.Bands.DeleteMedia(id)
        );
        const { message, success } = deleteResponse;
        success
            ? setVideos(videos.filter((el) => el.id !== id))
            : enqueueSnackbar(message, { variant: 'error' });
    };

    const confirmDelete = async (id: number | string) => {
        const dialogProps: SetDialogProps = {
            title: 'Do you want to delete this video?',
            text: 'This action is irreversible.',
            submitText: 'Delete',
            submitHandler: async () => {
                if (isYTVideo && typeof id === 'string')
                    submitYTVideoDelete(id);
                if (!isYTVideo && typeof id === 'number') submitVideoDelete(id);
            },
            cancelText: 'Cancel',
        };
        showDialog(dialogProps);
    };

    const handleDeleteClick = async () => {
        confirmDelete(mediaId);
    };

    return (
        <div
            title='Delete this video?'
            role='button'
            tabIndex={0}
            className={classes.iconWrapper}
            onClick={handleDeleteClick}
            onKeyDown={null}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Delete style={{ color: hover ? 'red' : 'black' }} />
        </div>
    );
};

export default DeleteVideoIcon;
