import { useRef } from 'react';
import { TimerState } from '../../timers';

interface Props {
  state: TimerState | null;
}

const TIMER_RADIUS = 45;
const totalLength = Math.PI * 2 * TIMER_RADIUS;

interface Dash {
  dashArray: number;
  dashOffset: number;
}

const computeDash = (state: TimerState | null): Dash => {
  if (state === null) {
    return { dashArray: totalLength, dashOffset: totalLength };
  }

  if (state.type === 'speech') {
    return { dashArray: totalLength, dashOffset: totalLength };
  }

  if (state.type === 'stopwatch') {
    return {
      dashArray: totalLength / 6,
      dashOffset: state.elapsed * (totalLength / 6)
    };
  }

  return {
    dashArray: totalLength,
    dashOffset: totalLength * (1 - state.progressRatio),
  };
}

const buildText = (state: TimerState | null): string => {
  if (state === null) {
    return '';
  }

  if (state.type === 'speech') {
    return '...';
  }

  if (state.type === 'stopwatch') {
    return `${state.elapsed}s`;
  }

  return `${state.remaining}s`;
}

export const Timer = ({ state }: Props) => {
  const dash = computeDash(state);
  const text = buildText(state);

  console.log(state, dash, text);

  return (
    <svg
      className="timer"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle
        cx="50"
        cy="50"
        r={TIMER_RADIUS}
        fill="none"
        stroke="#555"
        strokeWidth="8"
      />
      <circle
        className="progress"
        transform="rotate(-90 50 50)"
        cx="50"
        cy="50"
        r={TIMER_RADIUS}
        fill="none"
        stroke="lightblue"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={dash.dashArray}
        strokeDashoffset={dash.dashOffset}
      />
      <text
        className="timerText"
        x="50%"
        y="50%"
        dy="0.35em"
      >
        {text}
      </text>
    </svg>
  );
}
