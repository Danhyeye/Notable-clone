import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import noteReducer from './NoteSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        note: noteReducer,
    },
});

export default store;