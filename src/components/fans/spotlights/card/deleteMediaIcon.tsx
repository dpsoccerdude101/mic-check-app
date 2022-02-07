import { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { useDialog } from 'src/hooks';
import { useSnackbar } from 'notistack';
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
    background: 'white'
  }
});

type DeleteMediaIconProps = {
  deleteCallback: (deleted: boolean) => void;
  deleteUrl: string;
};

const DeleteMediaIcon = ({ deleteCallback, deleteUrl }: DeleteMediaIconProps) => {
  const classes = useStyles();
  const [hover, setHover] = useState(false);
  const { showDialog } = useDialog();
  const { enqueueSnackbar } = useSnackbar();

  const confirmDelete = async () => {
    const dialogProps: SetDialogProps = {
      title: 'Do you want to delete this spotlight?',
      text: 'This action is irreversible.',
      submitText: 'Delete',
      submitHandler: async () => {
        const deleteResponse: BaseResponse = await Api.delete(deleteUrl);
        const { message, success } = deleteResponse;
        if (!success) {
          enqueueSnackbar(message, { variant: 'error' });
        }
        deleteCallback(success);
      },
      cancelText: 'Cancel',
    };
    showDialog(dialogProps);
  };

  const handleDeleteClick = async () => {
    confirmDelete();
  };

  return (
    <div
      title='Delete this spotlight?'
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

export default DeleteMediaIcon;
