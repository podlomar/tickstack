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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        currentTimeline?.next();
      } else if (e.code === 'NumpadEnter' || e.code === 'Enter') {
        console.log('Toggling pause/resume');
        console.log('Current timer state:', timerState);
        if (currentTimeline?.running()) {
          currentTimeline?.pause();
        } else {
          currentTimeline?.resume();
        }
      }
    };

    if (currentTimeline) {
      currentTimeline.onStateChange(handleStateChange);
      currentTimeline.run();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      currentTimeline?.onStateChange(() => { });
      window.removeEventListener('keydown', handleKeyDown);
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
            <div className="timeline-title">{timeline.getTitle()}</div>
            <div className="timeline-subtitle">{timeline.getSubtitle()}</div>
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

