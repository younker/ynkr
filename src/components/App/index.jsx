import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Terminal from '../Terminal';

const focusLastInputFn = () => {
  try {
    return document
      .querySelectorAll('input[type=text]:not([readonly])')[0]
      .focus();
  } catch (e) {
    console.log('Unable to locate active prompt: ', e);
  }
};

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
