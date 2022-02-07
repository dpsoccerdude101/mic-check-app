import { useDialog } from 'src/hooks';
import { SetDialogProps } from 'src/types';

type ShowInfoButtonProps = {
  description: string;
};

const ShowInformationLink = ({ description }: ShowInfoButtonProps) => {
  const { closeDialog, showDialog } = useDialog();
  const showDetails = () => {
    const dialogProps: SetDialogProps = {
      title: 'Show Information',
      text: description,
      submitText: 'OK',
      submitHandler: async () => {
        closeDialog();
      },
      cancelText: null
    };
    showDialog(dialogProps);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    showDetails();
  };

  return (
    <a href='#' onClick={(e) => handleClick(e)}>
      Show Info
    </a>
  );
};

export default ShowInformationLink;
