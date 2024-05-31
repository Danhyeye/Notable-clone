import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import remarkGfm from 'remark-gfm';
import EditIcon from '@mui/icons-material/Edit';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import StarIcon from '@mui/icons-material/Star';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Radio, Input, Dropdown, Tag, Upload, List } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import 'github-markdown-css/github-markdown.css';
import 'tailwindcss/tailwind.css';
import { togglePin, toggleFavorite, addTag, deleteTag, moveNoteToTrash, restoreNote, deleteNotePermanently } from "../features/NoteSlice";
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const { TextArea } = Input;
const { Dragger } = Upload;

const Memo = () => {
    const dispatch = useDispatch();
    const selectedNote = useSelector(state => state.note.selectedNote);
    const [noteContent, setNoteContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [attachments, setAttachments] = useState([]);


    useEffect(() => {
        if (selectedNote) {
            const savedContent = localStorage.getItem(`noteContent_${selectedNote.id}`);
            setNoteContent(savedContent || selectedNote.content);
        }
    }, [selectedNote]);


    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setNoteContent(newContent);
        localStorage.setItem(`noteContent_${selectedNote.id}`, newContent);
    };

    const togglePinNote = () => {
        if (selectedNote && selectedNote.id) {
            dispatch(togglePin(selectedNote.id));
        } else {
            console.error('Selected note is not properly set');
        }
    };

    const toggleFavoriteNote = () => {
        if (selectedNote && selectedNote.id) {
            dispatch(toggleFavorite(selectedNote.id));
        } else {
            console.error("Error");
        }
    };

    const handleTagInputChange = (e) => {
        setTagInput(e.target.value);
    };

    const handleAddTag = () => {
        if (tagInput && selectedNote && selectedNote.id) {
            dispatch(addTag({ noteId: selectedNote.id, tag: tagInput }));
            setTagInput('');
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            const updatedNotes = notes.map(note => {
                if (note.id === selectedNote.id) {
                    return { ...note, tags: [...note.tags, tagInput] };
                }
                return note;
            });
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
        }
    };

    const handleDeleteTag = (tag) => {
        if (selectedNote && selectedNote.id) {
            dispatch(deleteTag({ noteId: selectedNote.id, tag }));
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            const updatedNotes = notes.map(note => {
                if (note.id === selectedNote.id) {
                    const updatedTags = note.tags.filter(t => t !== tag);
                    return { ...note, tags: updatedTags };
                }
                return note;
            });
            localStorage.setItem('notes', JSON.stringify(updatedNotes));
        }
    };

    const handleAttachmentChange = ({ fileList }) => {
        setAttachments(fileList);
    };

    const attachmentMenu = (
        <div className='w-32 h-20'>
            <Dragger
                fileList={attachments}
                onChange={handleAttachmentChange}
                multiple
                className="w-32 h-20"
            >
                <p className="ant-upload-drag-icon p-0">
                    <InboxOutlined />
                </p>

            </Dragger>
            <List
                dataSource={attachments}
                renderItem={item => (
                    <List.Item>
                        {item.name}
                    </List.Item>
                )}
            />
        </div>
    );


    const tagMenu = (
        <div className="flex flex-col">
            <div className='flex flex-col w-32'>
                {selectedNote?.tags?.map((tag, index) => (
                    <Tag className='m-0 ' key={index} closable onClose={() => handleDeleteTag(tag)}>
                        {tag}
                    </Tag>
                ))}
            </div>
            <Input
                className='w-32'
                placeholder="Add tag..."
                value={tagInput}
                onChange={handleTagInputChange}
                onPressEnter={handleAddTag}
                suffix={
                    <Button
                        onClick={handleAddTag}
                        style={{ border: 'none', padding: 0 }}
                        icon={<PlusOutlined />}
                    />
                }
            />
        </div>
    );

    const handleRestore = () => {
        if (selectedNote && selectedNote.id) {
            dispatch(restoreNote(selectedNote.id));
        } else {
            console.error("Error");
        }
    };

    const handleDeletePermanently = () => {
        if (selectedNote && selectedNote.id) {
            dispatch(deleteNotePermanently(selectedNote.id));
        } else {
            console.error("Error");
        }
    };

    const handleDelete = () => {
        if (selectedNote && selectedNote.id) {
            dispatch(moveNoteToTrash(selectedNote.id));
        } else {
            console.error("Error");
        }
    };



    return (
        // <Modal title="Note Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <>

            <MathJaxContext>
                <div className='p-0 w-full h-full border'>
                    <div className='mx-4 my-2 h-fit min-w-fit'>
                        <Radio.Group>
                            <Radio.Button value="edit" onClick={() => setIsEditing(!isEditing)} className="ant-radio-button-wrapper-default">
                                <EditIcon fontSize="small" />
                            </Radio.Button>
                            <Dropdown overlay={tagMenu} trigger={['click']}>
                                <Radio.Button value="tag" className="ant-radio-button-wrapper-default">
                                    <LocalOfferIcon fontSize="small" />
                                </Radio.Button>
                            </Dropdown>
                            <Dropdown overlay={attachmentMenu} trigger={['click']}>
                                <Radio.Button value="attachment" className="ant-radio-button-wrapper-default">
                                    <AttachFileIcon fontSize="small" />
                                </Radio.Button>
                            </Dropdown>
                            <Radio.Button value="favorite" onClick={toggleFavoriteNote} className="ant-radio-button-wrapper-default">
                                <StarIcon fontSize="small" />
                            </Radio.Button>
                            <Radio.Button value="pin" onClick={togglePinNote} className="ant-radio-button-wrapper-default">
                                <PushPinOutlinedIcon fontSize="small" />
                            </Radio.Button>




                            {!selectedNote?.inTrash ? (
                                <Radio.Button onClick={handleDelete} ><DeleteIcon fontSize="small" /></Radio.Button>
                            ) : (
                                <>
                                    <Button onClick={handleRestore} ><RestoreFromTrashIcon /></Button>
                                    <Button onClick={handleDeletePermanently} ><DeleteForeverIcon /></Button>
                                </>
                            )}
                        </Radio.Group>
                    </div>

                    <div className='w-full h-full ' >
                        {isEditing ? (
                            <TextArea
                                className='p-4 h-full'
                                value={noteContent}
                                onChange={handleContentChange}
                                placeholder="Nhập tiêu đề và nội dung ghi chú tại đây"
                                style={{ height: "fit-content", resize: 'none' }}

                            />
                        ) : (
                            <div className='markdown-body rounded-lg w-full h-full mx-4 p-4' style={{ height: "fit-content", backgroundColor: "black", color: "white" }}>
                                <ReactMarkdown

                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        math: ({ value }) => <MathJax>{`\\(${value}\\)`}</MathJax>,
                                        inlineMath: ({ value }) => <MathJax>{`\\(${value}\\)`}</MathJax>,
                                    }}
                                >
                                    {noteContent}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </MathJaxContext>
            {/* // </Modal> */}
        </>
    );
};

export default Memo;
