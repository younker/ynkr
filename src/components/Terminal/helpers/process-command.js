export default (state, { command, args }) => {
  const collection = [
    ...state.collection,
    { type: 'output', command, args },
    { type: 'input' },
  ];

  // The scrolling mechanism can mutate command history and since we do not want
  // those mutations persisting between executed commands, we always reset the
  // scroll state when processing a new command.
  const scroll = undefined;

  return { ...state, scroll, collection };
};
