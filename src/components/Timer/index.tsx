import { useRef } from 'react';
import { TimerState } from '../../timers';

interface Props {
  state: TimerState | null;
}

const TIMER_RADIUS = 45;
const totalLength = Math.PI * 2 * TIMER_RADIUS;

export const Timer = ({ state }: Props) => {
  const computeDashOffset = (state: TimerState | null) => {
    if (state === null) {
      return totalLength;
    }

    return totalLength * (1 - state.progressRatio);
  };

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
        strokeDasharray="283"
        strokeDashoffset={computeDashOffset(state)}
      />
      <text
        x="50%"
        y="50%"
        dy="0.35em"
        textAnchor="middle"
        fontSize="40"
        fill="white"
      >
        {state?.displayTime ?? '0s'}
      </text>
    </svg>
  );
}
