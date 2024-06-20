import { createSlice } from '@reduxjs/toolkit';

export const NoteSlice = createSlice({
    name: 'note',
    initialState: {
        selectedSort: 'Title',
        sortOrder: 'Asc',
        iconToggle: false,
        searchValue: '',
        noteCount: 0,
        favoriteCount: 0,
        tagCount: 0,
        tags: [],
        trashCount: 0,
        untaggedCount: 0,
        notes: [],
        selectedNoteContent: '',
        selectedNote: { id: null, title: '', content: '' },
        showTrashedNotes: false,
        currentFilter: 'All',
    },
    reducers: {
        setSelectedSort: (state, action) => {
            state.selectedSort = action.payload;
        },
        setSortOrder: (state, action) => {
            state.sortOrder = action.payload;
            const { selectedSort, notes } = state;
            if (selectedSort === 'Title') {
                state.notes = notes.sort((a, b) =>
                    action.payload === 'Asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
                );
            } else if (selectedSort === 'DateCreated') {
                state.notes = notes.sort((a, b) =>
                    action.payload === 'Asc' ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt)
                );
            } else if (selectedSort === 'DateModified') {
                state.notes = notes.sort((a, b) =>
                    action.payload === 'Asc' ? new Date(a.modifiedAt) - new Date(b.modifiedAt) : new Date(b.modifiedAt) - new Date(a.modifiedAt)
                );
            }
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
        setSelectedNoteContent: (state, action) => {
            state.selectedNoteContent = action.payload;
        },
        setSelectedNote: (state, action) => {
            state.selectedNote = action.payload;
        },
        addNote: (state, action) => {
            state.notes.push(action.payload);
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        updateNote: (state, action) => {
            const index = state.notes.findIndex(note => note.id === action.payload.id);
            if (index !== -1) {
                state.notes[index] = action.payload;
                localStorage.setItem('notes', JSON.stringify(state.notes));
            }
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
            localStorage.setItem('notes', JSON.stringify(state.notes));
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
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        addTag: (state, action) => {
            const { noteId, tag } = action.payload;
            const note = state.notes.find(note => note.id === noteId);
            if (note) {
                note.tags.push(tag);
            }
            if (!state.tags.includes(tag)) {
                state.tags.push(tag);
            }
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        deleteTag: (state, action) => {
            const { noteId, tag } = action.payload;
            const note = state.notes.find(note => note.id === noteId);
            if (note) {
                note.tags = note.tags.filter(t => t !== tag);
            }
            const notesWithTag = state.notes.filter(note => note.tags.includes(tag));
            if (notesWithTag.length === 0) {
                state.tags = state.tags.filter(t => t !== tag);
            }
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        moveNoteToTrash: (state, action) => {
            const note = state.notes.find(note => note.id === action.payload);
            if (note) {
                note.inTrash = true;
                localStorage.setItem('notes', JSON.stringify(state.notes));
            }
        },
        restoreNote: (state, action) => {
            const note = state.notes.find(note => note.id === action.payload);
            if (note) {
                note.inTrash = false;
                localStorage.setItem('notes', JSON.stringify(state.notes));
            }
        },
        deleteNotePermanently: (state, action) => {
            state.notes = state.notes.filter(note => note.id !== action.payload);
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
        setCurrentFilter: (state, action) => {
            state.currentFilter = action.payload;
        },
        updateNoteTitle(state, action) {
            const { id, title } = action.payload;
            const noteToUpdate = state.notes.find(note => note.id === id);
            if (noteToUpdate) {
                noteToUpdate.title = title;
            }
            localStorage.setItem('notes', JSON.stringify(state.notes));
        },
    }
});

export const {
    setSelectedSort, setSortOrder, toggleIcon, setSearchValue, clearSearch, setNoteCount, setFavoriteCount, setTagCount,
    setTags, setTrashCount, setUntaggedCount, addNote, setSelectedNoteContent, setSelectedNote, setNotes, updateNote,
    updateNoteTitle, togglePin, toggleFavorite, addTag, deleteTag, moveNoteToTrash, restoreNote, deleteNotePermanently, setCurrentFilter
} = NoteSlice.actions;

export default NoteSlice.reducer;
