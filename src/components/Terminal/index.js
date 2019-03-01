import * as R from 'ramda';
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';

import { Input, Output } from '../TerminalRow';

import './style.scss';

// A prompt is effectively a new command line input component
const PROMPT = { type: 'input', readonly: false };

class Terminal extends Component {
  constructor(props) {
    super(props);

    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);

    this.state = {
      collection: [{ ...PROMPT }]
    };
  }

  renderInput({ idx, readonly }) {
    return (
      <Input
        key={`input-${idx}`}
        keypressHandler={readonly ? null : this.onKeyUpHandler}
        readonly={readonly}
      />
    );
  }

  renderOutput({ idx, command, args }) {
    return (
      <Output
        key={`output-${idx}`}
        command={command}
        args={args}
      />
    );
  }

  render() {
    const termIO = this.state.collection.map(({ type, ...item }, idx) => {
      const args = { idx, ...item };
      return type === 'input' ? this.renderInput(args) : this.renderOutput(args);
    }, this);

    return (
      <Container className='Terminal' fluid='true'>
        { termIO }
      </Container>
    );
  }

  executeCommand(input) {
    // Step 1: modify the previous input field so that it is no longer active
    const previousInput = {
      ...this.state.collection.pop(), 
      readonly: true,
    };

    // Step 2: parse the input and prepare output
    const [command, ...args] = R.map(R.trim, input.split(' '));
    const newOutput = {
      type: 'output',
      command,
      args,
    }

    // Step 3: add a prompt
    const prompt = { ...PROMPT };

    // Step 4: "execute" the command (by rendering the newOutput)
    this.setState({
      collection: [
        ...this.state.collection,
        previousInput,
        newOutput,
        prompt,
      ],
    });
  }

  onKeyUpHandler(e) {
    // TODO: Desired functionality includes
    // keyCode == 93 && e.ctrlKey -- reverse search mode. This means we need to
    //   persist cmd history
    switch (e.keyCode) {
      case 13: // enter
        this.executeCommand(e.target.value);
        e.preventDefault();
        break;
      default:
        break;
    }
  }
}

export default Terminal;
