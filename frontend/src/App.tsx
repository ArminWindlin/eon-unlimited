import React from 'react';
import Board from './components/Board';
import './App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Board></Board>
      </header>
    </div>
  );
}

export default App;
