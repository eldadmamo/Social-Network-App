import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: '',
    profile: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action) => {
            const {token, profile} = action.payload;
            state.token = token;
            state.profile = profile;
        },
        clearUser: (state) => {
            state.token = '';
            state.profile = null;
        },
        updateUserProfile: (state) => {
            state.profile = action.payload;
            state.profile = null;
        },
    }
});

export const {addUser, clearUser, updateUserProfile} = userSlice.actions;
export default userSlice.reducer;