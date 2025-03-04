import { lazy, Suspense } from "react";
import { AuthTabs, ResetPassword } from "./pages";
import {useRoutes} from 'react-router-dom'
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import Streams from './pages/social/streams/Streams';


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
            path: '/app/social/streams',
            element: <Streams/>,  
        }
    ]);

    return element;
}

