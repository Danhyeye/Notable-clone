import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setSearchValue, clearSearch, addNote, toggleIcon, setSelectedSort, setSortOrder, getNotesByUserId, updateNoteState, setSelectedNote
} from '../features/NoteSlice';
import { Input, Button, Dropdown, Menu, Modal, Form, Radio, Upload } from "antd";
import { SearchOutlined, PlusOutlined, CloseOutlined, DownOutlined, UpOutlined, EditOutlined, TagOutlined, PaperClipOutlined, StarOutlined, PushpinOutlined, DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import NoteList from './NoteList';
import List from './List';
import NoteAPI from '../api/NoteAPI';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'react-toastify';

const Note = () => {
  const dispatch = useDispatch();
  const { searchValue, notes, iconToggle, selectedSort, sortOrder, selectedNote } = useSelector((state) => state.note);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [addForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSearchChange = (e) => {
    const searchInput = e.target.value;
    dispatch(setSearchValue(searchInput));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
    setFilteredNotes(notes.filter(note => !note.inTrash));
  };

  const handleAddNote = async () => {
    try {
      const values = await addForm.validateFields();
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID is not available');
        return;
      }

      const noteData = {
        userId,
        title: values.title,
        content: values.content,
        tags: [],
        attachments: [],
        favorite: false,
        pinned: false,
        inTrash: false,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };

      const createdNote = await NoteAPI.createNote(noteData);
      dispatch(addNote(createdNote));
      setIsAddModalVisible(false);
      addForm.resetFields();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleUpdateNote = async () => {
    try {
      const values = await updateForm.validateFields();
      const noteData = {
        title: values.title,
        content: noteContent,
        tags: selectedNote.tags,
        attachments: selectedNote.attachments,
        favorite: selectedNote.favorite,
        pinned: selectedNote.pinned,
        inTrash: selectedNote.inTrash,
        modifiedAt: new Date().toISOString()
      };

      const updatedNote = await NoteAPI.updateNote(selectedNote.id, noteData);
      dispatch(updateNoteState(updatedNote));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleMenuClick = (e) => {
    const newSortOrder = sortOrder === 'ascend' ? 'descend' : 'ascend';
    dispatch(setSelectedSort(e.key));
    dispatch(setSortOrder(newSortOrder));
    sortNotes(e.key, newSortOrder);
  };

  const handleNoteSelect = (note) => {
    dispatch(setSelectedNote({
      ...note,
      tags: note.tags || [],
      attachments: note.attachments || [],
      favorite: note.favorite ?? false,
      pinned: note.pinned ?? false,
      inTrash: note.inTrash ?? false,
    }));
    setNoteContent(note.content);
    setIsUpdateModalVisible(true);
    updateForm.setFieldsValue(note);
  };

  const handleContentChange = (e) => {
    setNoteContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    dispatch(setSelectedNote({ ...selectedNote, title: e.target.value }));
  };

  //eslint-disable-next-line
  const handleTagClick = async (tag) => {
    if (!selectedNote) {
      console.error('No selected note');
      return;
    }

    try {
      let updatedTags;
      if (selectedNote.tags.includes(tag)) {
        await NoteAPI.deleteTag(selectedNote.id, tag);
        updatedTags = selectedNote.tags.filter(t => t !== tag);
      } else {
        await NoteAPI.createTag(selectedNote.id, tag);
        updatedTags = [...selectedNote.tags, tag];
      }
      dispatch(setSelectedNote({ ...selectedNote, tags: updatedTags }));
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const handleAddTag = async () => {
    if (!selectedNote) {
      console.error('No selected note');
      return;
    }

    try {
      await NoteAPI.createTag(selectedNote.id, tagInput);
      const updatedTags = [...selectedNote.tags, tagInput];
      dispatch(setSelectedNote({ ...selectedNote, tags: updatedTags }));
      setTagInput('');
      setTagInputVisible(false);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const handleAttachmentClick = async (attachment) => {
    if (!selectedNote) {
      console.error('No selected note');
      return;
    }
    try {
      let updatedAttachments;
      if (selectedNote.attachments.includes(attachment)) {
        await NoteAPI.deleteAttachment(selectedNote.id, attachment);
        updatedAttachments = selectedNote.attachments.filter(a => a !== attachment);
      } else {
        await NoteAPI.createAttachment(selectedNote.id, attachment);
        updatedAttachments = [...selectedNote.attachments, attachment];
      }
      dispatch(setSelectedNote({ ...selectedNote, attachments: updatedAttachments }));
    } catch (error) {
      console.error('Error updating attachments:', error);
    }
  };

  const handleFavoriteClick = async () => {
    if (!selectedNote) {
      console.error('No selected note');
      return;
    }

    const updatedNote = { ...selectedNote, favorite: !selectedNote.favorite };
    dispatch(setSelectedNote(updatedNote)); // Update state immediately
    await NoteAPI.toggleFavorite(selectedNote.id, updatedNote.favorite);
    dispatch(updateNoteState(updatedNote));
  };

  const handlePinClick = async () => {
    if (!selectedNote) {
      console.error('No selected note');
      return;
    }

    const updatedNote = { ...selectedNote, pinned: !selectedNote.pinned };
    dispatch(setSelectedNote(updatedNote)); // Update state immediately
    await NoteAPI.togglePin(selectedNote.id, updatedNote.pinned);
    dispatch(updateNoteState(updatedNote));
  };

  const handleTrashClick = async (id) => {
    try {
      const updatedNote = { ...selectedNote, inTrash: true };
      await NoteAPI.updateNoteStatus(id, { inTrash: true });
      dispatch(updateNoteState(updatedNote));
      toast.success('Note moved to trash successfully!');
    } catch (error) {
      console.error('Error moving note to trash:', error);
      toast.error('Failed to move note to trash!');
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized access. Please login again.');
      }
    }
  };

  const handleRestoreClick = async (id) => {
    try {
      const updatedNote = { ...selectedNote, inTrash: false };
      await NoteAPI.updateNoteStatus(id, { inTrash: false });
      dispatch(updateNoteState(updatedNote));
      toast.success('Note restored from trash successfully!');
    } catch (error) {
      console.error('Error restoring note from trash:', error);
      toast.error('Failed to restore note from trash!');
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized access. Please login again.');
      }
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await NoteAPI.deleteNote(id);
      dispatch(updateNoteState(null));
      toast.success('Note deleted permanently!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note!');
      if (error.response && error.response.status === 401) {
        toast.error('Unauthorized access. Please login again.');
      }
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      handleAttachmentClick(file.name);
      return false;
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      dispatch(getNotesByUserId(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (searchValue) {
      const matchedNotes = notes.filter(note => note.title.toLowerCase().includes(searchValue.toLowerCase()) && !note.inTrash);
      setFilteredNotes(matchedNotes);
    } else {
      setFilteredNotes(notes.filter(note => !note.inTrash));
    }
  }, [notes, searchValue]);

  const sortNotes = (sortKey, sortOrder) => {
    const sortedNotes = [...filteredNotes].sort((a, b) => {
      if (sortKey === 'title') {
        if (sortOrder === 'ascend') {
          return a.title.localeCompare(b.title);
        } else {
          return b.title.localeCompare(a.title);
        }
      } else if (sortKey === 'createdAt' || sortKey === 'modifiedAt') {
        if (sortOrder === 'ascend') {
          return new Date(a[sortKey]) - new Date(b[sortKey]);
        } else {
          return new Date(b[sortKey]) - new Date(a[sortKey]);
        }
      }
      return 0;
    });
    setFilteredNotes(sortedNotes);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="title">
        <Button>Title</Button>
      </Menu.Item>
      <Menu.Item key="createdAt">
        <Button>Date Created</Button>
      </Menu.Item>
      <Menu.Item key="modifiedAt">
        <Button>Date Modified</Button>
      </Menu.Item>
    </Menu >
  );

  return (
    <>
      <ul className="block h-full min-w-10 max-w-full w-full px-5 py-1">
        <li className="flex justify-between w-auto">
          <div className="flex items-center min-w-20 max-w-full w-full">
            <List setNotesDisplay={setFilteredNotes} />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              suffix={
                searchValue ? (
                  <CloseOutlined onClick={handleClearSearch} style={{ cursor: 'pointer' }} />
                ) : (
                  <SearchOutlined />
                )
              }
            />
            <Dropdown overlay={menu} trigger={['click']} className='mx-4'>
              <Button onClick={(e) => e.preventDefault()} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}>
                <span className="text-xs">{selectedSort}</span> <DownOutlined />
              </Button>
            </Dropdown>
            <Button
              onClick={() => {
                dispatch(toggleIcon());
                dispatch(setSortOrder(iconToggle ? 'ascend' : 'descend'));
                sortNotes(selectedSort, iconToggle ? 'ascend' : 'descend');
              }}
              className="text-xs px-3 py-0">
              {iconToggle ? <UpOutlined /> : <DownOutlined />}
            </Button>
            <Button className='mx-2 my-2 border-0' onClick={() => setIsAddModalVisible(true)}><PlusOutlined /></Button>
          </div>
        </li>

        <li>
          <div>
            <NoteList notes={filteredNotes} onNoteSelect={handleNoteSelect} />
          </div>
        </li>
      </ul>

      <Modal
        title="Add Note"
        visible={isAddModalVisible}
        onOk={handleAddNote}
        onCancel={() => setIsAddModalVisible(false)}

      >
        <Form form={addForm} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title of the note!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please input the content of the note!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Update Note"
        visible={isUpdateModalVisible}
        onOk={handleUpdateNote}
        onCancel={() => setIsUpdateModalVisible(false)}
      >
        <div >
          <Radio.Group className="flex items-center space-x-2">
            <Button type="text" onClick={() => setIsEditing(!isEditing)} className="px-2">
              <EditOutlined fontSize="small" />
            </Button>
            <Button type="text" onClick={() => setTagInputVisible(!tagInputVisible)} className="px-2">
              <TagOutlined fontSize="small" />
            </Button>
            {tagInputVisible && (
              <div className="flex items-center space-x-2">
                <Input
                  size="small"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onPressEnter={handleAddTag}
                  className="flex-grow"
                />
                <Button type="text" onClick={handleAddTag}>
                  <PlusOutlined />
                </Button>
              </div>
            )}
            <Upload {...uploadProps}>
              <Button type="text" className="px-2">
                <PaperClipOutlined fontSize="small" />
              </Button>
            </Upload>
            <Button
              type="text"
              onClick={handleFavoriteClick}
              className="px-2"
              style={{ color: selectedNote?.favorite ? 'red' : 'inherit' }}
            >
              <StarOutlined fontSize="small" />
            </Button>
            <Button
              type="text"
              onClick={handlePinClick}
              className="px-2"
              style={{ color: selectedNote?.pinned ? 'green' : 'inherit' }}
            >
              <PushpinOutlined fontSize="small" />
            </Button>
            {!selectedNote?.inTrash ? (
              <Button type="text" onClick={() => handleTrashClick(selectedNote.id)} className="px-2">
                <DeleteOutlined fontSize="small" />
              </Button>
            ) : (
              <>
                <Button type="text" onClick={() => handleRestoreClick(selectedNote.id)} className="px-2">
                  <UndoOutlined fontSize="small" />
                </Button>
                <Button type="text" onClick={() => handleDeleteClick(selectedNote.id)} className="px-2">
                  <DeleteOutlined fontSize="small" />
                </Button>
              </>
            )}
          </Radio.Group>

        </div>
        <MathJaxContext>
          <Form form={updateForm} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please input the title of the note!' }]}
            >
              <Input onChange={handleTitleChange} />
            </Form.Item>

            <div className="w-full h-full">
              {isEditing ? (
                <Input.TextArea
                  value={noteContent}
                  onChange={handleContentChange}
                  placeholder="Enter your note here..."
                  style={{ height: "500px", resize: 'none' }}
                />
              ) : (
                <div className="markdown-body rounded-lg w-full h-full p-4 my-4" style={{ height: "fit-content", backgroundColor: "black", color: "white" }}>
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
          </Form>
        </MathJaxContext>
      </Modal>

    </>
  );
};

export default Note;
