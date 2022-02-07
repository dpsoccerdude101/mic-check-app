import { createContext, FC, useReducer } from 'react';
import { CustomDialog } from 'src/components';
import { ChildrenProps, SetDialogProps } from 'src/types';
import PropTypes from 'prop-types';

export interface DialogState {
    dialogProps: SetDialogProps;
    open: boolean;
}

const initialState: DialogState = {
    dialogProps: null,
    open: false,
};

interface DialogContextValue extends DialogState {
    showDialog: (props: SetDialogProps) => Promise<void>;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextValue>({
    ...initialState,
    showDialog: () => Promise.resolve(),
    closeDialog: () => {},
});

type ShowDialogAction = {
    type: 'SHOWDIALOG';
    payload: {
        dialogProps: SetDialogProps;
    };
};

type CloseDialogAction = {
    type: 'CLOSEDIALOG';
};

type Action = ShowDialogAction | CloseDialogAction;

const handlers: Record<
    string,
    (state: DialogState, action: Action) => DialogState
> = {
    SHOWDIALOG: (state: DialogState, action: ShowDialogAction): DialogState => {
        const { dialogProps } = action.payload;
        return {
            open: true,
            dialogProps,
        };
    },
    CLOSEDIALOG: (state: DialogState): DialogState => ({
        ...state,
        open: false,
    }),
};

const dialogReducer = (state: DialogState, action: Action): DialogState =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

export const DialogProvider: FC<ChildrenProps> = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(dialogReducer, initialState);
    const { dialogProps, open } = state;
    const showDialog = async (newProps: SetDialogProps): Promise<void> => {
        dispatch({ type: 'SHOWDIALOG', payload: { dialogProps: newProps } });
    };

    const closeDialog = (): void => {
        dispatch({ type: 'CLOSEDIALOG' });
    };

    return (
        <DialogContext.Provider value={{ ...state, showDialog, closeDialog }}>
            <CustomDialog
                closeDialogFunc={async () => closeDialog()}
                {...dialogProps}
                open={open}
            >
                {dialogProps && dialogProps.children}
            </CustomDialog>
            {children}
        </DialogContext.Provider>
    );
};

DialogProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export default DialogContext;
