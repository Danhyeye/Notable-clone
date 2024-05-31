import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Modal } from 'antd';
import { setSelectedNote, updateNoteTitle, togglePin, toggleFavorite } from '../features/NoteSlice';
import { PushPin, Star as StarIcon } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Masonry from 'react-masonry-css';
import '../styles/masonry.css';
import ReactMarkdown from 'react-markdown';
import { MathJax } from 'better-react-mathjax';
import remarkGfm from 'remark-gfm';
import Memo from './Memo'; // Import the Memo component

const NoteList = ({ notes }) => {
    const dispatch = useDispatch();
    const [editingId, setEditingId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const { currentFilter, selectedNote } = useSelector(state => state.note);
    // eslint-disable-next-line
    const [noteContent, setNoteContent] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        notes.forEach(note => {
            const savedTitle = localStorage.getItem(`noteTitle_${note.id}`);
            if (savedTitle) {
                dispatch(updateNoteTitle({ id: note.id, title: savedTitle }));
            }
        });
    }, [dispatch, notes]);

    useEffect(() => {
        if (selectedNote) {
            const savedContent = localStorage.getItem(`noteContent_${selectedNote.id}`);
            setNoteContent(savedContent || selectedNote.content);
        }
    }, [selectedNote]);

    const handleNoteSelect = (noteId) => {
        const selectedNote = notes.find(note => note.id === noteId);
        dispatch(setSelectedNote(selectedNote));
        setIsModalVisible(true);
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setNewTitle(newTitle);
        if (editingId) {
            localStorage.setItem(`noteTitle_${editingId}`, newTitle);
        }
    };

    const handleKeyDown = (e, noteId) => {
        if (e.key === 'F2') {
            setEditingId(noteId);
            const selectedNote = notes.find(note => note.id === noteId);
            setNewTitle(localStorage.getItem(`noteTitle_${noteId}`) || selectedNote.title);
        } else if (e.key === 'Enter' && editingId) {
            dispatch(updateNoteTitle({ id: editingId, title: newTitle }));
            setEditingId(null);
        }
    };

    const togglePinNote = (noteId) => {
        dispatch(togglePin(noteId));
    };

    const toggleFavoriteNote = (noteId) => {
        dispatch(toggleFavorite(noteId));
    };

    const filteredNotes = notes.filter(note => {
        if (currentFilter === 'Trash') {
            return note.inTrash;
        }
        if (currentFilter === 'All') {
            return !note.inTrash;
        }
        if (currentFilter === 'Tag') {
            return note.tags && note.tags.length > 0 && !note.inTrash;
        }
        if (currentFilter === 'Favorites') {
            return note.favorite && !note.inTrash;
        }
        if (currentFilter === 'Untagged') {
            return note.tags.length === 0 && !note.inTrash;
        }
        return note.tags.includes(currentFilter) && !note.inTrash;
    });

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {filteredNotes.map(note => (
                    <div key={note.id} onClick={() => handleNoteSelect(note.id)} onKeyDown={(e) => handleKeyDown(e, note.id)} tabIndex={0} className="note-item my-6 hover:bg-white ">
                        {editingId === note.id ? (
                            <Input
                                value={newTitle}
                                onChange={handleTitleChange}
                                autoFocus
                            />
                        ) : (
                            <button className='w-full flex flex-col justify-between items-center '>
                                <div className='flex flex-col items-center h-full'>
                                    <span className="text-left">{note.title}</span>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            math: ({ value }) => <MathJax>{`\\(${value}\\)`}</MathJax>,
                                            inlineMath: ({ value }) => <MathJax>{`\\(${value}\\)`}</MathJax>,
                                        }}
                                    >{localStorage.getItem(`noteContent_${note.id}`) || note.content}</ReactMarkdown>
                                </div>
                                <div className='flex items-center'>
                                    {note.pinned && (
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                togglePinNote(note.id);
                                            }}
                                            size="small"
                                            edge="end"
                                        >
                                            <PushPin fontSize="small" />
                                        </IconButton>
                                    )}
                                    {note.favorite && (
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavoriteNote(note.id);
                                            }}
                                            size='small'
                                            edge="end"
                                        >
                                            <StarIcon fontSize='small' />
                                        </IconButton>
                                    )}
                                </div>
                            </button>
                        )}
                    </div>
                ))}
            </Masonry>

            <Modal
                title="Note Details"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={1000}
            >
                <Memo />
            </Modal>
        </>
    );
};

export default NoteList;
