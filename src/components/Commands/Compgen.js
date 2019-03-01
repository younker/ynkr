import React from 'react';

import { publicCommands } from '../Commands';

const Compgen = (props) => {
  const commands = Object
    .keys(publicCommands)
    .filter((cmd) => (cmd !== 'compgen'))
    .map((cmd) => (<li>{cmd}</li>));

  return <ul>{commands}</ul>;
}

export default Compgen;
