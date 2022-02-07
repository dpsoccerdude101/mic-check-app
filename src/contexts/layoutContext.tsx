import { createContext, FC, useReducer, useState } from 'react';
import { CustomDialog } from 'src/components';
import { ChildrenProps, SetDialogProps } from 'src/types';
import PropTypes from 'prop-types';
import { defaultPageLayout } from 'src/constants/appConstants';
import Layout from 'src/constants/layouts';

export interface LayoutState {
    layout: Layout;
}

const initialState: LayoutState = {
    layout: defaultPageLayout,
};

interface LayoutContextValue extends LayoutState {
    setLayout: (layout: Layout) => void;
    layout: Layout;
}

const LayoutContext = createContext<LayoutContextValue>({
    ...initialState,
    setLayout: () => {},
});

export const LayoutProvider: FC<ChildrenProps> = (props) => {
    const { children } = props;
    const [layout, setLayout] = useState(initialState.layout);

    return (
        <LayoutContext.Provider
            value={{ layout: layout, setLayout: setLayout }}
        >
            {children}
        </LayoutContext.Provider>
    );
};

LayoutProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export default LayoutContext;
