import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import Terminal from '../Terminal';

const focusLastInputFn = () => {
  const els = document.querySelectorAll('input[type=text]:not([readonly])');
  if (els.length > 0) {
    // if we somehow have more than 1 readonly input (we have a bug), pick the
    // last one
    els[els.length - 1].focus();
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
