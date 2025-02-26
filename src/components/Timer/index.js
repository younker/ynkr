import React, { useState, useEffect } from 'react';

const RUNNING = 'running';
const PAUSED = 'paused';

const DEFAULT_STATE = {
  runtime: 0,
  start: undefined,
  state: PAUSED,
};

const getCurrDate = (offset = 0) => (new Date()).getTime() - offset;

const clearTimer = (timer) => clearTimeout(timer);

const Timer = ({ action }) => {
  const [state, setState] = useState(DEFAULT_STATE);

  const scheduleUpdate = () => {
    const start = state.start || getCurrDate(state.runtime);
    const runtime = getCurrDate() - start;
    return setTimeout(() => setState({ runtime, start, state: RUNNING }), 100);
  };

  /* eslint-disable */
  useEffect(() => {
    if (action === 'run') {
      const timer = scheduleUpdate();
      return () => clearTimer(timer);
    } else if (action === 'pause' && state.state !== PAUSED) {
      setState({ ...state, start: undefined, state: PAUSED });
    } else if (action === 'reset') {
      setState(DEFAULT_STATE);
    }
  }, [action, state]);
  /* eslint-enable */
  return (
    <span className="Timer">
      {(state.runtime / 1000).toFixed(1)}
    </span>
  );
};

export default Timer;
