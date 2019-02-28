import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Terminal from '../Terminal';
import './style.scss';

const focusLastInputFn = () => (
  document.querySelectorAll('input[type=text]:not([readonly])')[0].focus()
);

const App = (props) => {
  useEffect(() => document.body.addEventListener('click', focusLastInputFn));

  return (
    <div className='App'>
      <Navbar />
      <Terminal />
    </div>
  );
};

export default App;
