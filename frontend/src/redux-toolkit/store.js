import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../redux-toolkit/reducers/user/user.reducer'
import suggestionsReduce from '../redux-toolkit/reducers/suggestions/suggestions.reducer'
import notificationReducer from '../redux-toolkit/reducers/suggestions/suggestions.reducer'
import modalReducer from '../redux-toolkit/reducers/model/modal.reducer'
import postReducer from '../redux-toolkit/reducers/post/post.reducer'

export const store = configureStore({
    reducer: {
        user: userReducer,
        suggestions: suggestionsReduce,
        notifications: notificationReducer,
        modal: modalReducer,
        post: postReducer,
        allPosts: postReducer
    }
})