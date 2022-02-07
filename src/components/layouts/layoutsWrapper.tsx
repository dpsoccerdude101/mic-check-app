import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { SearchProvider } from 'src/contexts';
import LayoutContext from 'src/contexts/layoutContext';
import { useAuth } from 'src/hooks';
import NavLayout from './navLayout';
import SimpleLayout from './simpleLayout';

function log(x: string) {
    console.log(`%cLayoutsWrapper: %c${x}`, 'color:blue;', '');
}

const LayoutsWrapper = ({ children }) => {
    const { isInitialized, isAuthenticated } = useAuth();

    const { layout } = useContext(LayoutContext);
    //let layout = 'standard';

    const chooseLayout = () => {
        if (!isInitialized) return <div />;

        if (layout === 'simple') {
            log('Choosing simple layout');
            return <SimpleLayout>{children}</SimpleLayout>;
        } else if (layout === 'standard') {
            log('Choosing standard layout');
            return (
                <SearchProvider>
                    <NavLayout>{children}</NavLayout>
                </SearchProvider>
            );
        }
        console.error('No layout chosen!');
        return <div />;
    };

    return chooseLayout();
};

LayoutsWrapper.propTypes = {
    chilren: PropTypes.any,
};

export default LayoutsWrapper;

// import PropTypes from 'prop-types';
// import { SearchProvider } from 'src/contexts';
// import { useAuth } from '../../hooks';
// import NavLayout from './navLayout';
// import UnauthorizedLayout from './unauthorizedLayout';

// const LayoutsWrapper = ({ children }) => {
//     const { isInitialized, isAuthenticated } = useAuth();
//     const chooseLayout = () => {
//         if (!isInitialized) return <div />;

//         if (!isAuthenticated)
//             return <UnauthorizedLayout>{children}</UnauthorizedLayout>;

//         return (
//             <SearchProvider>
//                 <NavLayout>{children}</NavLayout>
//             </SearchProvider>
//         );
//     };

//     return chooseLayout();
// };

// LayoutsWrapper.propTypes = {
//     chilren: PropTypes.any,
// };

// export default LayoutsWrapper;
