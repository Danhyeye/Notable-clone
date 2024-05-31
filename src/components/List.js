import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/tailwind.css';
import SummarizeIcon from '@mui/icons-material/Summarize';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { Button } from 'antd';
import { setCurrentFilter, setNoteCount, setFavoriteCount, setTagCount, setTags, setTrashCount, setUntaggedCount, addNote, setNotes } from '../features/NoteSlice';
import notesData from '../db.json';
import { store } from '../features/store';
import { Drawer } from 'antd';
import MenuIcon from '@mui/icons-material/Menu';
const List = () => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.note.notes);
  const tags = useSelector(state => state.note.tags);
  // const showTrashedNotes = useSelector(state => state.note.showTrashedNotes);

  // const toggleShowTrashedNotes = () => {
  //   dispatch(setShowTrashedNotes(!showTrashedNotes));
  // };
  // Filter out notes that are in the trash
  const activeNotes = notes.filter(note => !note.inTrash);

  const noteCount = activeNotes.length;
  const favoriteCount = activeNotes.filter(note => note.favorite).length;
  const untaggedCount = activeNotes.filter(note => note.tags.length === 0).length;
  const trashCount = notes.filter(note => note.inTrash).length;
  const taggedCount = activeNotes.filter(note => note.tags.length > 0).length;

  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const countNotesWithTag = (notes, tagName) => {
    return notes.filter(note =>
      note.tags.some(tag => tag.toLowerCase() === tagName.toLowerCase())
    ).length;
  };


  const handleFilterChange = (filter) => {
    dispatch(setCurrentFilter(filter));
  };

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
      dispatch(setNotes(savedNotes));
    } else {
      notesData.notes.forEach(note => {
        dispatch(addNote(note));
      });
    }
    const currentNotes = store.getState().note.notes;
    const activeNotes = currentNotes.filter(note => !note.inTrash);
    dispatch(setNoteCount(activeNotes.length));
    const favoriteCount = activeNotes.filter(note => note.favorite).length;
    dispatch(setFavoriteCount(favoriteCount));
    const tagCount = new Set(activeNotes.flatMap(note => note.tags)).size;
    dispatch(setTagCount(tagCount));
    const allTags = new Set();
    activeNotes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag));
    });
    dispatch(setTags(Array.from(allTags)));
    const trashCount = currentNotes.filter(note => note.inTrash).length;
    dispatch(setTrashCount(trashCount));
    const untaggedCount = activeNotes.filter(note => note.tags.length === 0).length;
    dispatch(setUntaggedCount(untaggedCount));
  }, [dispatch]);

  return (
    <>
      <Button className='mx-2 my-2 border-0' onClick={showDrawer}  ><MenuIcon /></Button>
      <Drawer
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <ul className="block h-screen left-0 w-full border px-1">
          <li className="m-2 w-100">
            <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('All')}>
              <div className="flex items-center space-x-2">
                <SummarizeIcon fontSize="small" />
                <span>All notes</span>
              </div>
              <span>{noteCount}</span>
            </Button>
          </li>
          <li className="m-2 w-100">
            <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('Favorites')}>
              <div className="flex items-center space-x-2">
                <StarIcon fontSize="small" />
                <span>Favorites</span>
              </div>
              <span>{favoriteCount}</span>
            </Button>
          </li>
          <li className="m-2 w-100">
            <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('Tag')}>
              <div className="flex items-center space-x-2">
                <LocalOfferIcon fontSize="small" />
                <span>Tags</span>
              </div>
              <span>{taggedCount}</span>
            </Button>
            <div className="flex flex-col space-y-2 mt-2">
              {tags && tags.map(tag => {
                const tagCount = countNotesWithTag(activeNotes, tag);
                return tagCount > 0 ? (
                  <Button key={tag} className="w-full flex items-center justify-between space-x-2" onClick={() => handleFilterChange(tag)}>
                    <div className="flex items-center space-x-2">
                      <span>{tag}</span>
                    </div>
                    <span>{tagCount}</span>
                  </Button>
                ) : null;
              })}
            </div>
          </li>
          {untaggedCount > 0 && (
            <li className="m-2 w-100">
              <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('Untagged')}>
                <div className="flex items-center space-x-2">
                  <FeedbackIcon fontSize="small" />
                  <span>Untagged</span>
                </div>
                <span>{untaggedCount}</span>
              </Button>
            </li>
          )}
          <li className="m-2 w-100">
            <Button block className="flex items-center justify-between space-x-2" onClick={() => handleFilterChange('Trash')}>
              <div className="flex items-center space-x-2">
                <DeleteIcon fontSize="small" />
                <span>Trash</span>
              </div>
              <span>{trashCount}</span>
            </Button>
          </li>
        </ul>
      </Drawer>
    </>
  );
};

export default List;
