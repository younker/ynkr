import { trim } from 'ramda';

const extractCommandHistoryFromState = ({ collection }) => {
  return collection
    .map(({ command, args }) => trim([command, args].join(' ')))
    .reduce((acc, el) => {
      if (el) { acc.push(el); }
      return acc;
    }, []);
};

export default (state, { direction, input }) => {
  let scroll = state.scroll;

  if (!scroll) {
    let commands = extractCommandHistoryFromState(state);

    // Set the current position of the cursor to the current command line and
    // push the current input into the command history so that when they scroll
    // back, they do not lose their current command
    const cursor = commands.length;
    commands.push(input.current.value);
    scroll = { cursor, commands };
  } else {
    // Save the current, potentially modified, command so that it persists
    // should they scroll back to this position
    scroll.commands[scroll.cursor] = input.current.value;
  }

  // Scrolling "up" translates to decrementing the cursor until, at last, we
  // reach index position 0. Conversely, scrolling "down" means we increment
  // the cursor until we reach the final (current) command
  let offset = direction === 'up' ? -1 : 1;

  const cursor = scroll.cursor + offset;
  if (scroll.commands[cursor] !== undefined) {
    input.current.value = scroll.commands[cursor];
    state.scroll = { ...scroll, cursor };
  }

  return state;
};
