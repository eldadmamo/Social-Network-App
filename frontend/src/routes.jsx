import { lazy, Suspense } from "react";
import { AuthTabs } from "./pages";
import {useRoutes} from 'react-router-dom'


export const AppRouter = () => {
    const element = useRoutes([
        {
            path: '/',
            element: <AuthTabs/>,  
        }
    ]);

    return element;
}

