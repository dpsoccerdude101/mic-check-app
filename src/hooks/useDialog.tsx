import { useContext } from 'react';
import { DialogContext } from '../contexts';

const useDialog = () => useContext(DialogContext);

export default useDialog;
