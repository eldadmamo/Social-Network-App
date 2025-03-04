import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../redux-toolkit/reducers/user/user.reducer'

export const store = configureStore({
    reducer: {
        user: userReducer
    }
})