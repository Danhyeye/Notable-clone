import React, { useState, useEffect } from 'react';
import "../styles/tailwind.css";
import { useSelector, useDispatch } from 'react-redux';
import { setSearchValue, clearSearch, addNote, setNotes, toggleIcon, setSelectedSort, setSortOrder } from '../features/NoteSlice';
import { Input, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, PlusOutlined, CloseOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import NoteList from './NoteList';

const Note = () => {
  const dispatch = useDispatch();
  const { searchValue, notes, iconToggle, selectedSort, sortOrder } = useSelector((state) => state.note);
  const [filteredNotes, setFilteredNotes] = useState(notes);

  const handleSearchChange = (e) => {
    const searchInput = e.target.value;
    dispatch(setSearchValue(searchInput));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
    setFilteredNotes(notes);
  };

  const handleAddNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: '',
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      favorite: false,
      inTrash: false,
      pinned: false,
      tags: [],
      attachments: []
    };
    const updatedNotes = [...notes, newNote];
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    dispatch(addNote(newNote));
  };

  const handleMenuClick = (e) => {
    dispatch(setSelectedSort(e.key));
    dispatch(setSortOrder(sortOrder));
  };

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
      dispatch(setNotes(savedNotes));
    }
  }, [dispatch]);

  useEffect(() => {
    if (searchValue) {
      const matchedNotes = notes.filter(note => note.title.toLowerCase().includes(searchValue.toLowerCase()));
      const unmatchedNotes = notes.filter(note => !note.title.toLowerCase().includes(searchValue.toLowerCase()));
      setFilteredNotes([...matchedNotes, ...unmatchedNotes]);
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchValue]);

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="Title">
        <Button>Title</Button>
      </Menu.Item>
      <Menu.Item key="DateCreated">
        <Button>Date Created</Button>
      </Menu.Item>
      <Menu.Item key="DateModified">
        <Button>Date Modified</Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <ul className="block h-full min-w-10 max-w-full w-full px-5 py-1">
        <li className="flex justify-between w-auto">
          <div className="flex items-center min-w-20 max-w-full w-full space-x-2">
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
            <Dropdown overlay={menu} trigger={['click']}>
              <Button onClick={(e) => e.preventDefault()} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2 }}>
                <span className="text-xs">{selectedSort}</span> <DownOutlined />
              </Button>
            </Dropdown>
            <Button
              onClick={() => {
                dispatch(toggleIcon());
                dispatch(setSortOrder(iconToggle ? 'Asc' : 'Desc'));
              }}
              className="text-xs px-3 py-0">
              {iconToggle ? <UpOutlined /> : <DownOutlined />}
            </Button>
            <Button className="px-2 py-0 m-1 ml-4" onClick={handleAddNote}><PlusOutlined /></Button>
          </div>
        </li>

        <li>
          <div>
            <NoteList notes={filteredNotes} />
          </div>
        </li>
      </ul>
    </>
  );
};

export default Note;
