export default (state) => {
  const collection = [
    ...state.collection,
    { type: 'input' }
  ];

  // The scrolling mechanism can mutate command history and since we do not want
  // those mutations persisting between executed commands, we always reset the
  // scroll state when adding a new prompt.
  const scroll = undefined;

  return { ...state, scroll, collection };
};
