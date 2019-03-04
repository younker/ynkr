export default (state) => {
  const collection = [
    ...state.collection,
    { type: 'input' }
  ];

  // See Terminal/helpers/process-command.js for the answer to why we do this
  // here.
  const scroll = undefined;

  return { ...state, scroll, collection };
};
