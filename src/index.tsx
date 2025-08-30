import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { timelines } from './timelines';
import './styles.css';

const appElement = document.getElementById('app')!;
const root = createRoot(appElement);

root.render(<App timelines={timelines} />);

// for (const timeline of Object.values(timelines)) {
//   const button = document.createElement('button');
//   button.textContent = timeline.getTitle();
//   button.addEventListener('click', () => {
//     timeline.onStateChange((state) => {
//       console.log(state);
//     });
//     timeline.run();
//     currentTimeline = timeline;
//     document.querySelector('#total-duration')!.textContent = `Total Duration: ${formatDuration(timeline.getTotalDuration() ?? 0)}`;
//   });
//   timelinesElement.appendChild(button);
// }

// const formatDuration = (seconds: number): string => {
//   const minutes = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${minutes} min ${secs} sec`;
// };
