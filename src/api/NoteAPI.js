import axiosClient from './axiosClient';

const NoteAPI = {
    getNotesByUserId: async (userId) => {
        try {
            const response = await axiosClient.get(`/notes/user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createNote: async (noteData) => {
        try {
            const response = await axiosClient.post('/notes/create-note', noteData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateNote: async (id, noteData) => {
        try {
            const response = await axiosClient.put(`/notes/update-note/${id}`, noteData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteNote: async (id) => {
        try {
            const response = await axiosClient.delete(`/notes/delete-note/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    toggleFavorite: async (id, favorite) => {
        try {
            const response = await axiosClient.put(`/notes/update-status/${id}`, { favorite });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    togglePin: async (id, pinned) => {
        try {
            const response = await axiosClient.put(`/notes/update-status/${id}`, { pinned });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateNoteStatus: async (id, status) => {
        try {
            const response = await axiosClient.put(`/notes/update-status/${id}`, status);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createTag: async (noteId, tag) => {
        try {
            const response = await axiosClient.post('/notes/create-tag', { noteId, tag });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteTag: async (noteId, tag) => {
        try {
            const response = await axiosClient.delete('/notes/delete-tag', { data: { noteId, tag } });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createAttachment: async (noteId, attachment) => {
        try {
            const response = await axiosClient.post('/notes/create-attachment', { noteId, attachment });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteAttachment: async (noteId, attachment) => {
        try {
            const response = await axiosClient.delete('/notes/delete-attachment', { data: { noteId, attachment } });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getFavoriteNotes: async (userId) => {
        try {
            const response = await axiosClient.get(`/notes/user/${userId}/favorites`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTaggedNotes: async (userId) => {
        try {
            const response = await axiosClient.get(`/notes/user/${userId}/tags`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getUntaggedNotes: async (userId) => {
        try {
            const response = await axiosClient.get(`/notes/user/${userId}/untagged`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTrashedNotes: async (userId) => {
        try {
            const response = await axiosClient.get(`/notes/user/${userId}/trash`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAllTags: async (userId) => {
        try {
            const response = await axiosClient.get(`/notes/user/${userId}/all-tags`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default NoteAPI;
