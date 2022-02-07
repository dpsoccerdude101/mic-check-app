import { ReactNode } from 'react';

type BaseDialogProps = {
  open: boolean;
  closeDialogFunc: () => Promise<void>;
};

type SetDialogProps = {
  title: string;
  text: string;

  children?: ReactNode;

  cancelText?: string;
  cancelHandler?: () => Promise<void>;

  submitText: string;
  submitHandler: () => Promise<void>;
};

export type CustomDialogProps = BaseDialogProps & SetDialogProps;

export default SetDialogProps;
