import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import { UiRoutes } from "src/constants";
import { useAuth } from "src/hooks";

interface RouteGuardProps {
    children: ReactElement<any>,
    pageProps: any;
}

export const RouteGuard = (props: RouteGuardProps) => {
    const { children, pageProps } = props;
    const { user, goHome, isAuthenticated } = useAuth();
    const router = useRouter();

    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        setIsAllowed(false);

        checkPermissions();
        
        router.events.on('routeChangeComplete', () => setIsAllowed(true));

        return () => {
            router.events.off('routeChangeComplete', () => setIsAllowed(true));
        }
    }, []);

    const checkPermissions = () => {
        if (pageProps && pageProps.requiredPermissions && pageProps.requiredPermissions.length !== 0) {
            if (isAuthenticated) {
                const requiredPagePermissions = pageProps.requiredPermissions;
                const userPermissions = user.permissions;

                setIsAllowed(userPermissions.some(permissions => 
                    requiredPagePermissions.includes(pagePermission => 
                        permissions.name === pagePermission) && permissions.isGranted));

                if (!isAllowed) {
                    goHome();           
                }
            } else {
                setIsAllowed(false);
                const currentUrl = router.pathname;
                router.push({
                    pathname: UiRoutes.Auth.Login,
                    query: {
                        returnUrl: currentUrl
                    }
                });
            }
        } else {
            setIsAllowed(true);
        }
    };

    return (isAllowed && children);
};

export default RouteGuard;