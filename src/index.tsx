import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { timelines, exercises, timers } from './timelines';
import './styles.css';

const appElement = document.getElementById('app')!;
const root = createRoot(appElement);

root.render(<App timelines={timelines} exercises={exercises} timers={timers} />);
