import React from 'react';
import './styles/tailwind.css';
import List from './components/List';
import Note from './components/Note';

function App() {
    return (
        <div className='flex'>
            <List />
            <Note />
        </div>
    );
}

export default App;
