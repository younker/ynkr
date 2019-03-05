export default (state, { command, args }) => {
  const collection = [
    ...state.collection,
    { type: 'output', command, args },
  ];

  return { ...state, collection };
};
