import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NoteAPI from '../api/NoteAPI';

export const getNotesByUserId = createAsyncThunk('note/getNotesByUserId', async (userId, { rejectWithValue }) => {
    try {
        const response = await NoteAPI.getNotesByUserId(userId);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateNote = createAsyncThunk('note/updateNote', async ({ id, noteData }, { rejectWithValue }) => {
    try {
        const response = await NoteAPI.updateNote(id, noteData);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const moveNoteToTrash = createAsyncThunk('note/moveNoteToTrash', async (id, { rejectWithValue }) => {
    try {
        const response = await NoteAPI.moveNoteToTrash(id);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const restoreNoteFromTrash = createAsyncThunk('note/restoreNoteFromTrash', async (id, { rejectWithValue }) => {
    try {
        const response = await NoteAPI.restoreNoteFromTrash(id);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const NoteSlice = createSlice({
    name: 'note',
    initialState: {
        selectedSort: 'Title',
        sortOrder: 'Asc',
        iconToggle: false,
        searchValue: '',
        notes: [],
        selectedNote: null,
        showTrashedNotes: false,
        currentFilter: 'All',
        noteCount: 0,
        favoriteCount: 0,
        tagCount: 0,
        tags: [],
        trashCount: 0,
        untaggedCount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedSort: (state, action) => {
            state.selectedSort = action.payload;
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
        },
        toggleIcon: (state) => {
            state.iconToggle = !state.iconToggle;
            state.sortOrder = state.iconToggle ? 'Asc' : 'Desc';
        },
        setSearchValue: (state, action) => {
            state.searchValue = action.payload;
        },
        clearSearch: (state) => {
            state.searchValue = '';
        },
        setSelectedNote: (state, action) => {
            state.selectedNote = action.payload;
        },
        addNote: (state, action) => {
            state.notes.push(action.payload);
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        updateNoteState: (state, action) => {
            const index = state.notes.findIndex(note => note.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
            }
        },
        setCurrentFilter: (state, action) => {
            state.currentFilter = action.payload;
        },
        setNoteCount: (state, action) => {
            state.noteCount = action.payload;
        },
        setFavoriteCount: (state, action) => {
            state.favoriteCount = action.payload;
        },
        setTagCount: (state, action) => {
            state.tagCount = action.payload;
        },
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        setTrashCount: (state, action) => {
            state.trashCount = action.payload;
        },
        setUntaggedCount: (state, action) => {
            state.untaggedCount = action.payload;
        },
        togglePin: (state, action) => {
            const noteId = action.payload;
            const updatedNotes = state.notes.map(note => {
                if (note.id === noteId) {
                    return { ...note, pinned: !note.pinned };
                }
                return note;
            }).sort((a, b) => b.pinned - a.pinned);
            state.notes = updatedNotes;
        },
        toggleFavorite: (state, action) => {
            const noteId = action.payload;
            const updatedNotes = state.notes.map(note => {
                if (note.id === noteId) {
                    return { ...note, favorite: !note.favorite };
                }
                return note;
            }).sort((a, b) => b.favorite - a.favorite);
            state.notes = updatedNotes;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotesByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotesByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.notes = action.payload;
            })
            .addCase(getNotesByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.notes.findIndex(note => note.id === action.payload.id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    setSelectedSort,
    setSortOrder,
    toggleIcon,
    setSearchValue,
    clearSearch,
    addNote,
    setSelectedNote,
    setNotes,
    updateNoteState,
    setCurrentFilter,
    setNoteCount,
    setFavoriteCount,
    setTagCount,
    setTags,
    setTrashCount,
    setUntaggedCount,
    togglePin,
    toggleFavorite
} = NoteSlice.actions;

export default NoteSlice.reducer;
