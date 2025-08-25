import { Countdown, Timeline } from './timers.js';
const timeline = new Timeline([
    new Countdown(10, 'Prepare for quads stretch'),
    new Countdown(30, 'Quads stretch for {{remains}} seconds'),
    new Countdown(5, 'Switch legs'),
    new Countdown(30, 'Quads stretch for {{remains}} seconds'),
    new Countdown(5, 'Prepare for calf stretch'),
    new Countdown(30, 'Calf stretch for {{remains}} seconds'),
    new Countdown(3, 'Switch legs'),
    new Countdown(30, 'Calf stretch for {{remains}} seconds'),
    new Countdown(15, 'Prepare for supta virasana'),
    new Countdown(20, 'Supta virasana for {{remains}} seconds'),
    new Countdown(10, 'Prepare for downward dog'),
    new Countdown(45, 'Downward dog for {{remains}} seconds'),
    new Countdown(15, 'Prepare for hip flexor stretch'),
    new Countdown(45, 'Hip flexor stretch for {{remains}} seconds'),
    new Countdown(15, 'Switch legs'),
    new Countdown(45, 'Hip flexor stretch for {{remains}} seconds'),
    new Countdown(20, 'Prepare for front split'),
    new Countdown(30, 'Front split for {{remains}} seconds'),
    new Countdown(15, 'Switch legs'),
    new Countdown(30, 'Front split for {{remains}} seconds'),
    new Countdown(15, 'Prepare for pigeon stretch'),
    new Countdown(45, 'Pigeon stretch for {{remains}} seconds'),
    new Countdown(15, 'Switch legs'),
    new Countdown(45, 'Pigeon stretch for {{remains}} seconds'),
    new Countdown(15, 'Prepare for seated forward bend'),
    new Countdown(45, 'Seated forward bend for {{remains}} seconds'),
    new Countdown(15, 'Prepare for butterfly stretch'),
    new Countdown(60, 'Butterfly stretch for {{remains}} seconds'),
    new Countdown(15, 'Prepare for figure four stretch'),
    new Countdown(30, 'Figure four stretch for {{remains}} seconds'),
    new Countdown(5, 'Switch legs'),
    new Countdown(30, 'Figure four stretch for {{remains}} seconds'),
    new Countdown(15, 'Prepare for lower back stretch'),
    new Countdown(30, 'Lower back stretch for {{remains}} seconds'),
    new Countdown(5, 'Switch sides'),
    new Countdown(30, 'Lower back stretch for {{remains}} seconds'),
    new Countdown(60, 'Cool down and relax'),
    new Countdown(20, 'Get ready for meditation'),
    new Countdown(60 * 7, 'Meditation time for 7 minutes! Relax and breathe deeply', 'Congratulations! You have completed the stretching morning routine!'),
]);
document.querySelector('#startButton').addEventListener('click', () => {
    timeline.run();
});
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
};
document.querySelector('#total-duration').textContent = `Total Duration: ${formatDuration(timeline.getTotalDuration())}`;
