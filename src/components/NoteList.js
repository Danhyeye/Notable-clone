import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import '../styles/masonry.css';
import ReactMarkdown from 'react-markdown';
import { MathJax } from 'better-react-mathjax';
import remarkGfm from 'remark-gfm';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { DownOutlined, StarOutlined, PushpinOutlined, DeleteOutlined } from '@ant-design/icons';
import NoteAPI from '../api/NoteAPI';
import { useDispatch } from 'react-redux';
import { updateNoteState, setSelectedNote } from '../features/NoteSlice';
import { toast } from 'react-toastify';

const NoteList = ({ notes, onNoteSelect }) => {
    const dispatch = useDispatch();
    const [openDropdowns, setOpenDropdowns] = useState({});

    const handleNoteSelect = (note) => {
        if (onNoteSelect) {
            onNoteSelect(note);
        }
    };

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    const parseJSON = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return [];
        }
    };

    const handleDropdownClick = (noteId, type) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [`${noteId}-${type}`]: !prevState[`${noteId}-${type}`]
        }));
    };

    const handleDeleteTag = async (noteId, tag) => {
        try {
            await NoteAPI.deleteTag(noteId, tag);
            const updatedNote = notes.find(note => note.id === noteId);
            const parsedTags = parseJSON(updatedNote.tags);
            const newTags = JSON.stringify(parsedTags.filter(t => t !== tag));
            const updatedNoteCopy = { ...updatedNote, tags: newTags };
            dispatch(updateNoteState(updatedNoteCopy));
            dispatch(setSelectedNote(updatedNoteCopy));
            toast.success('Tag deleted successfully!');
        } catch (error) {
            console.error('Error deleting tag:', error);
            toast.error('Failed to delete tag!');
        }
    };

    const handleDeleteAttachment = async (noteId, attachment) => {
        try {
            await NoteAPI.deleteAttachment(noteId, attachment);
            const updatedNote = notes.find(note => note.id === noteId);
            const parsedAttachments = parseJSON(updatedNote.attachments);
            const newAttachments = JSON.stringify(parsedAttachments.filter(a => a !== attachment));
            const updatedNoteCopy = { ...updatedNote, attachments: newAttachments };
            dispatch(updateNoteState(updatedNoteCopy));
            dispatch(setSelectedNote(updatedNoteCopy));
            toast.success('Attachment deleted successfully!');
        } catch (error) {
            console.error('Error deleting attachment:', error);
            toast.error('Failed to delete attachment!');
        }
    };

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid break-all"
            columnClassName="my-masonry-grid_column"
        >
            {notes.map(note => (
                <div
                    key={note.id}
                    onClick={() => handleNoteSelect(note)}
                    tabIndex={0}
                    className="note-item my-6 p-4 rounded-lg shadow-md bg-gray-100 hover:bg-black hover:text-white transform transition-transform duration-300 hover:scale-105"
                >
                    <div className='w-full flex flex-col justify-between items-start'>
                        <div className='flex justify-between items-center w-full mb-2'>
                            <span className="text-left text-lg font-bold">{note.title}</span>
                            <div className='flex items-center space-x-2'>
                                <Tooltip title={note.pinned ? 'Unpin' : 'Pin'}>
                                    <Button
                                        icon={<PushpinOutlined className={note.pinned ? 'text-green-500' : 'text-gray-500'} />}
                                        shape="circle"
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Tooltip>
                                <Tooltip title={note.favorite ? 'Unfavorite' : 'Favorite'}>
                                    <Button
                                        icon={<StarOutlined className={note.favorite ? 'text-red-500' : 'text-gray-500'} />}
                                        shape="circle"
                                        size="small"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className='flex flex-col h-full note-content whitespace-pre-line max-h-96 truncate mb-2'>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    math: ({ value }) => <MathJax>{`\\(${value}\\)`}</MathJax>,
                                    inlineMath: ({ value }) => <MathJax>{`\\(${value}\\)`}</MathJax>,
                                }}
                            >{note.content}</ReactMarkdown>
                        </div>
                        <Dropdown
                            overlay={
                                <Menu>
                                    {parseJSON(note.tags).map(tag => (
                                        <Menu.Item key={tag}>
                                            {tag}
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                shape="circle"
                                                type="link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTag(note.id, tag);
                                                }}
                                            />
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            }
                            trigger={['click']}
                            onVisibleChange={() => handleDropdownClick(note.id, 'tags')}
                            visible={openDropdowns[`${note.id}-tags`] || false}
                        >
                            <div className='flex items-center cursor-pointer' onClick={(e) => e.stopPropagation()}>
                                <div className='mr-2'>Tags</div>
                                <DownOutlined />
                            </div>
                        </Dropdown>
                        <Dropdown
                            overlay={
                                <Menu>
                                    {parseJSON(note.attachments).map(attachment => (
                                        <Menu.Item key={attachment}>
                                            {attachment}
                                            <Button
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                shape="circle"
                                                type="link"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAttachment(note.id, attachment);
                                                }}
                                            />
                                        </Menu.Item>
                                    ))}
                                </Menu>
                            }
                            trigger={['click']}
                            onVisibleChange={() => handleDropdownClick(note.id, 'attachments')}
                            visible={openDropdowns[`${note.id}-attachments`] || false}
                        >
                            <div className='flex items-center cursor-pointer mt-2' onClick={(e) => e.stopPropagation()}>
                                <div className='mr-2'>Attachments</div>
                                <DownOutlined />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            ))}
        </Masonry>
    );
};

export default NoteList;
