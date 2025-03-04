import { lazy, Suspense } from "react";
import { AuthTabs, ResetPassword } from "./pages";
import {useRoutes} from 'react-router-dom'
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import Streams from './pages/social/streams/Streams';
import Social from "./pages/social/Social";


export const AppRouter = () => {
    const element = useRoutes([
        {
            path: '/',
            element: <AuthTabs/>,  
        },
        {
            path: '/forgot-password',
            element: <ForgotPassword/>,  
        },
        {
            path: '/reset-password',
            element: <ResetPassword/>,  
        },
        {
            path: '/app/social',
            element: <Social/>,
            children: [
                {
                    path: 'streams',
                    element: <Streams/>,  
                },
            ]  
        }
    ]);

    return element;
}

