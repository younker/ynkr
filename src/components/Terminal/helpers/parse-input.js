import * as R from 'ramda';

const stripPrependingDashes = s => s.replace(/^-+/, '');

const parseArguments = (args) => {
  if (!args) {
    return;
  }

  let parsed = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    const next = args[i + 1];
    if (i === 0 && key.substr(0, 1) !== '-') {
      parsed['subCommand'] = key;
    } else if (!next || next.substr(0,1) === '-') {
      // The next entry is an arg which means this is a flag. Default to true
      const clean = stripPrependingDashes(key);
      parsed[clean] = true;
    } else {
      // The next entry is the value for this arg
      const clean = stripPrependingDashes(key);
      parsed[clean] = args[++i];
    }
  }
  return parsed;
};

export default (input) => {
  const [command, ...rawArgs] = R.map(R.trim, input.split(' '));
  const args = parseArguments(rawArgs);
  return { command, args };
};
