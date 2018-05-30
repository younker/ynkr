import React, { Component } from 'react';
import Navbar from '../Navbar';
import Terminal from '../Terminal';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Terminal />
      </div>
    );
  }
}

export default App;
