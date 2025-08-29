import { TimerState } from '../../timers';

interface Props {
  state: TimerState | null;
}

export const Timer = ({ state }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
    >
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="lightgray"
        strokeWidth="5"
      />
      <circle
        transform="rotate(-90 50 50)"
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="283"
        strokeDashoffset="150"
      />
      <text
        x="50%"
        y="50%"
        dy="0.35em"
        textAnchor="middle"
        fontSize="40"
      >
        {state?.displayTime}
      </text>
    </svg>
  );
}
