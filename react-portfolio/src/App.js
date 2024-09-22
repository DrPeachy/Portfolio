import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyNavbar from './components/Navbar';
import Cursor from './components/Cursor';
import About from './components/About';
import Home from './components/Home';
import Game from './components/Game';
import Model from './components/Model';
import Resume from './components/Resume';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <MyNavbar />
        <Cursor />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/me" element={<About />} />
          <Route path="/game" element={<Game />} />
          <Route path="/model" element={<Model />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
