import { lazy, Suspense } from "react";
import { AuthTabs, ResetPassword } from "./pages";
import {useRoutes} from 'react-router-dom'
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";


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
        }
    ]);

    return element;
}

