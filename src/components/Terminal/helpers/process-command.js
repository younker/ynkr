import parseArgs from '../../../util/parse-args';

export default (state, { command, args }) => {
  const collection = [
    ...state.collection,
    { type: 'output', command, args: parseArgs(args) },
  ];

  return { ...state, collection };
};
