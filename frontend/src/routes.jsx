import { lazy, Suspense } from "react";
import { AuthTabs, ResetPassword } from "./pages/auth/index";
import {useRoutes} from 'react-router-dom'
import ForgotPassword from "./pages/auth/forgot-password/ForgotPassword";
import Streams from './pages/social/streams/Streams';
import Photo from "./pages/social/photos/photo";

import Videos from "./pages/social/videos/video";
import Profiles from "./pages/social/profile/profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import Error from "./pages/error/Error";
import StreamsSkeleton from "./pages/social/streams/StreamsSkeleton";

const Social = lazy(()=> import('./pages/social/Social'))
const Chat = lazy(()=> import('./pages/social/chat/Chat'))
const Followers = lazy(()=> import('./pages/social/followers/followers'))
const Following = lazy(()=> import('./pages/social/following/following'))
const Notifications = lazy(()=> import('./pages/social/notifications/notifications'))
const People = lazy(()=> import('./pages/social/people/people'))
const Photo = lazy(()=> import('./pages/social/photos/photo'))
const Profiles = lazy(()=> import('./pages/social/profile/profile'))
const Streams = lazy(()=> import('./pages/social/streams/Streams'))

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
                    element: (
                    <Suspense fallback={<StreamsSkeleton/>}>
                        <Streams/>
                    </Suspense>
                    )  
                },
                {
                    path: 'chat/messages',
                    element: (
                        <Suspense>
                            <Chat/>
                        </Suspense>
                    )  
                },
                {
                    path: 'people',
                    element: (
                        <Suspense>
                            <People/>
                        </Suspense>
                    ),  
                },
                {
                    path: 'followers',
                    element: (
                        <Suspense>
                            <Followers/>
                        </Suspense>
                    ),  
                },
                {
                    path: 'following',
                    element: (
                        <Suspense>
                            <Following/>
                        </Suspense>
                    ),  
                },
                {
                    path: 'photos',
                    element: (
                        <Suspense>
                            <Photo/>
                        </Suspense>
                    ),  
                },
                {
                    path: 'videos',
                    element: (
                        <Suspense>
                            <Videos/>
                        </Suspense>
                    )
                      
                  },
                {
                    path: 'notifications',
                    element: (
                        <Suspense>
                            <Notifications/>
                        </Suspense>
                    )  
                },
                {
                    path: 'profile/:username',
                    element: (
                        <Suspense>
                            <Profiles/>
                        </Suspense>
                    )  
                },
            ]  
        },
        {
            path: '*',
            element: <Error/>
        }
    ]);

    return element;
}

