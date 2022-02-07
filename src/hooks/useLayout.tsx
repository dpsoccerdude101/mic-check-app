import { useContext, useEffect } from 'react';
import { defaultPageLayout } from 'src/constants/appConstants';
import Layout from 'src/constants/layouts';
import LayoutContext from 'src/contexts/layoutContext';

/* ADC 2021-09-17
    I felt that we needed a way to switch page layouts on a per-page basis...

    The ticket management update requires us to open parts of the the system to unauthorized users
    (e.g., band profile pages, ticket order pages, guest checkout pages, etc...). So, they should 
    be able to use the standard layout too. 

    Originally, we used a 'standard' layout (i.e., NavLayout) when someone was logged in and  
    a different layout (i.e., UnauthorizedLayout) if somone was not logged in.

    The idea of this hook is to create a simple way to allow nextjs pages to choose what layout they
    wanted to be rendered in. 
    
    This hook can be used on a page to choose the desired layout. When the page component is unmounted 
    (i.e., we navigate to another page), we automatically switch back to the default page layout. This 
    way, every page should be rendered inside the default layout unless otherwise specified. 
    
    At least in theory...
*/

const useLayout = (
    layoutOnPageEnter: Layout,
    layoutOnPageExit: Layout = defaultPageLayout
): null => {
    const layoutContext = useContext(LayoutContext);
    useEffect(() => {
        setLayoutInContext(layoutOnPageEnter);
        return () => {
            setLayoutInContext(layoutOnPageExit);
        };
    }, []);

    function setLayoutInContext(layout) {
        console.log(
            `useLayout('${layoutOnPageEnter}', '${layoutOnPageExit}'): Setting ${layout} layout in context`
        );
        layoutContext.setLayout(layout);
    }
    return null;
};

export default useLayout;
