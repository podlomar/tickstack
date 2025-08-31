import { useEffect, useState } from "react";
import { Timeline, TimerState } from "../../timers";
import { Timer } from "../Timer";

interface Props {
  timelines: Timeline[];
}

export const App = ({ timelines }: Props) => {
  const [currentTimeline, setCurrentTimeline] = useState<Timeline | null>(null);
  const [timerState, setTimerState] = useState<TimerState | null>(null);

  useEffect(() => {
    const handleStateChange = (state: TimerState) => {
      setTimerState(state);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        currentTimeline?.next();
      }
    };

    if (currentTimeline) {
      currentTimeline.onStateChange(handleStateChange);
      currentTimeline.run();
    }

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      currentTimeline?.onStateChange(() => { });
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentTimeline]);

  return (
    <div>
      <h1>TickStack</h1>
      <div className="timerContainer">
        <Timer state={timerState} />
      </div>
      <div id="total-duration" className="total-duration">Total Duration: 0 s</div>
      <div id="timelines">
        {timelines.map((timeline) => (
          <button
            key={timeline.getTitle()}
            onClick={() => {
              setCurrentTimeline(timeline);
            }}
          >
            {timeline.getTitle()}
          </button>
        ))}
      </div>
      <div id="timer-container">
        <div id="countdown" className="countdown">0 s</div>
        <button
          className="next"
          onClick={() => {
            currentTimeline?.next();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

