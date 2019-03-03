import { trim } from 'ramda';

export default (state, { direction, input }) => {
  let scroll = state.scroll;
  if (!scroll) {
    let commands = state.collection
      .map((el) => {
        return el.command ? trim([el.command, el.args].join(' ')) : null;
      })
      .reduce((acc, el) => {
        if (el) { acc.push(el); }
        return acc;
      }, []);

    // Set the current position of the cursor to the current command line
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
