import parseTerminalInput from './parse-input';

export default (state, { command: input }) => {
  const { command, args } = parseTerminalInput(input);
  const collection = [
    ...state.collection,
    { type: 'output', original: input, command, args },
  ];

  return { ...state, collection };
};
