import React from 'react';
import './style.css';

const CommandLine = props => (
  <div className="CommandLine">
    <span>{props.prompt}</span>
    <input
      type="text"
      autoFocus={props.focus}
      onKeyUp={props.keypressHandler}
      value={props.cmd}
      readOnly={props.readonly}
    />
    <p className="output">{props.output}</p>
  </div>
);

export default CommandLine;
