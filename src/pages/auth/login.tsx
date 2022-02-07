import { useContext, useEffect } from 'react';
import { LoginPage } from 'src/components';
import LayoutContext from 'src/contexts/layoutContext';
import { useLayout } from 'src/hooks';

export default function LogIn() {
    // const layoutContext = useContext(LayoutContext);
    // useEffect(() => {
    //     setLayoutInContext('simple');
    //     return () => {
    //         setLayoutInContext('standard');
    //     };
    // }, []);

    // function setLayoutInContext(layout) {
    //     console.log(`Setting ${layout} layout in context`);
    //     layoutContext.setLayout(layout);
    // }
    useLayout('simple');
    return <LoginPage />;
}
