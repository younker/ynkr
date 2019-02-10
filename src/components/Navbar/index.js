import React from 'react';
import { Navbar } from 'react-bootstrap';
import './style.css';

const MyNavbar = props => (
  <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="//ynkr.org">
      <span className="blend">Jason</span>
      Y<span className="blend">ou</span>nk<span className="blend">e</span>r.org
    </Navbar.Brand>
  </Navbar>
);

export default MyNavbar;
