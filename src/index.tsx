import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { timelines } from './timelines';
import './styles.css';

const appElement = document.getElementById('app')!;
const root = createRoot(appElement);

root.render(<App timelines={timelines} />);
