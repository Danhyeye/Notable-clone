import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/tailwind.css';
import { Summarize, Star, Delete, Menu } from '@mui/icons-material';
import { Button, Drawer } from 'antd';
import NoteAPI from '../api/NoteAPI';
import {
  setCurrentFilter,
  setNoteCount,
  setFavoriteCount,
  setTrashCount,
} from '../features/NoteSlice';

const List = ({ setNotesDisplay }) => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.note.notes);
  const userId = localStorage.getItem('userId');
  const [visible, setVisible] = useState(false);

  const fetchNotes = async (filter) => {
    let fetchedNotes = [];
    try {
      switch (filter) {
        case 'All':
          fetchedNotes = await NoteAPI.getNotesByUserId(userId);
          break;
        case 'Favorites':
          fetchedNotes = await NoteAPI.getFavoriteNotes(userId);
          break;
        case 'Trash':
          fetchedNotes = await NoteAPI.getTrashedNotes(userId);
          break;
        default:
          fetchedNotes = await NoteAPI.getNotesByUserId(userId);
      }
      setNotesDisplay(fetchedNotes.filter(note => filter === 'Trash' || !note.inTrash));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleFilterChange = (filter) => {
    dispatch(setCurrentFilter(filter));
    fetchNotes(filter);
  };

  useEffect(() => {
    fetchNotes('All');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);

  useEffect(() => {
    const activeNotes = notes.filter(note => !note.inTrash);
    const favoriteCount = notes.filter(note => note.favorite && !note.inTrash).length;
    const trashCount = notes.filter(note => note.inTrash).length;

    dispatch(setNoteCount(activeNotes.length));
    dispatch(setFavoriteCount(favoriteCount));
    dispatch(setTrashCount(trashCount));
  }, [dispatch, notes]);

  return (
    <>
      <Button className='mx-2 my-2 border-0' onClick={showDrawer}><Menu /></Button>
      <Drawer
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
        width={300}
      >
        <ul className="block h-screen left-0 w-full px-1">
          <li className="m-2 w-100">
            <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('All')}>
              <div className="flex items-center space-x-2">
                <Summarize fontSize="small" />
                <span>All notes</span>
              </div>
              <span>{notes.filter(note => !note.inTrash).length}</span>
            </Button>
          </li>
          <li className="m-2 w-100">
            <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('Favorites')}>
              <div className="flex items-center space-x-2">
                <Star fontSize="small" />
                <span>Favorites</span>
              </div>
              <span>{notes.filter(note => note.favorite && !note.inTrash).length}</span>
            </Button>
          </li>
          <li className="m-2 w-100">
            <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('Trash')}>
              <div className="flex items-center space-x-2">
                <Delete fontSize="small" />
                <span>Trash</span>
              </div>
              <span>{notes.filter(note => note.inTrash).length}</span>
            </Button>
          </li>
        </ul>
      </Drawer>
    </>
  );
};

export default List;
