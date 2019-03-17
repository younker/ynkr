const stripPrependingDashes = s => s.replace(/^-+/, '');

export default (args = []) => {
  let parsed = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    const next = args[i + 1];
    if (key.substr(0, 1) !== '-') {
      // invalid arg. just ignore it for now. However, in the future we might
      // accept something like:
      //   $ command sub-command --help
      // In which case this block would be required
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
