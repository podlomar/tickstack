import { Counter, Timeline } from './timers.js';
const stretching = new Timeline([
    new Counter(10, 'Prepare for quads stretch'),
    new Counter(30, 'Quads stretch for {{remains}} seconds'),
    new Counter(5, 'Switch legs'),
    new Counter(30, 'Quads stretch for {{remains}} seconds'),
    new Counter(5, 'Prepare for calf stretch'),
    new Counter(30, 'Calf stretch for {{remains}} seconds'),
    new Counter(3, 'Switch legs'),
    new Counter(30, 'Calf stretch for {{remains}} seconds'),
    new Counter(15, 'Prepare for supta virasana'),
    new Counter(20, 'Supta virasana for {{remains}} seconds'),
    new Counter(10, 'Prepare for downward dog'),
    new Counter(45, 'Downward dog for {{remains}} seconds'),
    new Counter(15, 'Prepare for hip flexor stretch'),
    new Counter(45, 'Hip flexor stretch for {{remains}} seconds'),
    new Counter(15, 'Switch legs'),
    new Counter(45, 'Hip flexor stretch for {{remains}} seconds'),
    new Counter(20, 'Prepare for front split'),
    new Counter(30, 'Front split for {{remains}} seconds'),
    new Counter(15, 'Switch legs'),
    new Counter(30, 'Front split for {{remains}} seconds'),
    new Counter(15, 'Prepare for pigeon stretch'),
    new Counter(45, 'Pigeon stretch for {{remains}} seconds'),
    new Counter(15, 'Switch legs'),
    new Counter(45, 'Pigeon stretch for {{remains}} seconds'),
    new Counter(15, 'Prepare for seated forward bend'),
    new Counter(45, 'Seated forward bend for {{remains}} seconds'),
    new Counter(15, 'Prepare for butterfly stretch'),
    new Counter(60, 'Butterfly stretch for {{remains}} seconds'),
    new Counter(15, 'Prepare for figure four stretch'),
    new Counter(30, 'Figure four stretch for {{remains}} seconds'),
    new Counter(5, 'Switch legs'),
    new Counter(30, 'Figure four stretch for {{remains}} seconds'),
    new Counter(15, 'Prepare for lower back stretch'),
    new Counter(30, 'Lower back stretch for {{remains}} seconds'),
    new Counter(5, 'Switch sides'),
    new Counter(30, 'Lower back stretch for {{remains}} seconds'),
    new Counter(60, 'Cool down and relax'),
    new Counter(20, 'Get ready for meditation'),
    new Counter(60 * 7, 'Meditation time for 7 minutes! Relax and breathe deeply', 'Congratulations! You have completed the stretching morning routine!'),
]);
const wednesday = new Timeline([
    new Counter(10, 'Prepare for squats'),
    new Counter('stopwatch', 'Squats set 1'),
    new Counter(60, 'Rest for {{remains}} seconds'),
    new Counter('stopwatch', 'Squats set 2'),
    new Counter(60, 'Rest for {{remains}} seconds'),
    new Counter('stopwatch', 'Squats set 3'),
    new Counter(60, 'Relax and prepare for next exercise'),
    new Counter(15, 'Prepare for glute bridges'),
    new Counter(50, 'Glute bridge for {{remains}} seconds'),
    new Counter(50, 'Rest for {{remains}} seconds'),
    new Counter(50, 'Glute bridge for {{remains}} seconds'),
    new Counter(50, 'Rest for {{remains}} seconds'),
    new Counter(50, 'Glute bridge for {{remains}} seconds', 'Great job! You have completed the morning workout!'),
]);
let timeline = null;
document.querySelector('#startStretching').addEventListener('click', () => {
    stretching.run();
    timeline = stretching;
});
document.querySelector('#startWednesday').addEventListener('click', () => {
    wednesday.run();
    timeline = wednesday;
});
document.querySelector('#nextButton').addEventListener('click', () => {
    timeline?.next();
});
window.onkeyup = (e) => {
    if (e.code === 'Space') {
        timeline?.next();
    }
};
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
};
document.querySelector('#total-duration').textContent = `Total Duration: ${formatDuration(stretching.getTotalDuration())}`;
