import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserAPI from '../api/UserAPI';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await UserAPI.getUser();
    return response.user;
});

export const loginUser = createAsyncThunk('user/loginUser', async (credentials) => {
    const response = await UserAPI.login(credentials);
    return response.user;
});

const UserSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            UserAPI.logout();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('userId', action.payload.id);
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { logoutUser } = UserSlice.actions;
export default UserSlice.reducer;
