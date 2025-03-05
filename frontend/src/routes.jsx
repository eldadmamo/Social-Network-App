import { lazy, Suspense } from "react";
import { AuthTabs, ResetPassword } from "./pages/auth/index";
import {useRoutes} from 'react-router-dom'
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import Streams from './pages/social/streams/Streams';
import Social from "./pages/social/Social";
import Chat from "./pages/social/chat/Chat";
import People from "./pages/social/people/people";
import Followers from "./pages/social/followers/followers";
import Following from "./pages/social/following/following";
import Photo from "./pages/social/photos/photo";
import Notifications from "./pages/social/notifications/notifications";
import Videos from "./pages/social/videos/video";
import Profiles from "./pages/social/profile/profile";
import ProtectedRoute from "./pages/ProtectedRoute";


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
            element: (
                <ProtectedRoute>
                   <Social/>
                </ProtectedRoute>
                ),
            children: [
                {
                    path: 'streams',
                    element: <Streams/>,  
                },
                {
                    path: 'chat/messages',
                    element: <Chat/>,  
                },
                {
                    path: 'people',
                    element: <People/>,  
                },
                {
                    path: 'followers',
                    element: <Followers/>,  
                },
                {
                    path: 'following',
                    element: <Following/>,  
                },
                {
                    path: 'photos',
                    element: <Photo/>,  
                },
                {
                    path: 'videos',
                    element: <Videos/>
                      
                  },
                {
                    path: 'notifications',
                    element: <Notifications/>,  
                },
                {
                    path: 'profile/:username',
                    element: <Profiles/>,  
                },
            ]  
        }
    ]);

    return element;
}

