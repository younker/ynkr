import React, { Component } from 'react';
import CommandLine from './CommandLine';
import _ from 'lodash/fp';

const defaultItemState = {
  focus: true,
  prompt: '$',
  output: null,
  readonly: false
};

class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: [_.clone(defaultItemState)]
    };
  }

  render() {
    const output = this.state.collection.map((item, i) => {
      return (
        <CommandLine
          key={i}
          focus={item.focus}
          keypressHandler={this.onKeyUpHandler.bind(this)}
          prompt={item.prompt}
          output={item.output}
          readonly={item.readonly}
        />
      );
    }, this);

    return <div className="Terminal">{output}</div>;
  }

  onKeyUpHandler(e) {
    // TODO: Desired functionality includes
    // keyCode == 93 && e.ctrlKey -- reverse search mode. This means we need to
    //   persist cmd history
    switch (e.keyCode) {
      case 13: // enter
        const previous = _.merge(this.state.collection.pop(), {
          readonly: true,
          output: this.execCmd(e.target.value),
          focus: false
        });

        this.setState({
          collection: [
            ...this.state.collection,
            previous,
            _.clone(defaultItemState)
          ]
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
}

export default Terminal;
