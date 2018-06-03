import React, { Component } from 'react';
import Navbar from '../Navbar';
import Terminal from '../Terminal';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <div style={{ float: 'right', marginRight: '10px' }}>
          The Cobbler's children have no shoes...and I don't have a real
          website.
        </div>
        <Terminal />
      </div>
    );
  }
}

export default App;
