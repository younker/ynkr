import React, { Component } from 'react';
import CommandLine from './CommandLine';

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: true,
      prompt: '$',
      output: null,
      readonly: false
    };
  }

  onKeyUpHandler(e) {
    // TODO: Desired functionality includes
    // keyCode == 93 && e.ctrlKey -- reverse search mode. This means we need to
    //   persist cmd history
    switch (e.keyCode) {
      case 13: // enter
        this.setState({
          output: this.execCmd(e.target.value),
          readonly: true
        });
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  execCmd(cmd) {
    let out;
    switch (cmd) {
      case 'man':
        out = 'What manual page do you want?';
        break;
      default:
        out = `ynkr: command not found: ${cmd}`;
    }
    return out;
  }

  render() {
    return (
      <div className="Terminal">
        <CommandLine
          focus={this.state.focus}
          keypressHandler={this.onKeyUpHandler.bind(this)}
          prompt={this.state.prompt}
          output={this.state.output}
          readonly={this.state.readonly}
        />
      </div>
    );
  }
}

export default Terminal;
