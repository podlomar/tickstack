import { Counter, Phrase, Timeline } from './timers';

const kneePushUps = [
  new Counter(15, 'Prepare for knee push-ups'),
  new Counter('stopwatch', 'Knee push-ups set 1'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter('stopwatch', 'Knee push-ups set 2'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter('stopwatch', 'Knee push-ups set 3'),
];

const squats = [
  new Counter(15, 'Prepare for squats'),
  new Counter('stopwatch', 'Squats set 1'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter('stopwatch', 'Squats set 2'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter('stopwatch', 'Squats set 3'),
];

const gluteBridges = [
  new Counter(15, 'Prepare for glute bridges'),
  new Counter(50, 'Glute bridge for {{remains}} seconds'),
  new Counter(50, 'Rest for {{remains}} seconds'),
  new Counter(50, 'Glute bridge for {{remains}} seconds'),
  new Counter(50, 'Rest for {{remains}} seconds'),
  new Counter(50, 'Glute bridge for {{remains}} seconds'),
];

const ringRows = [
  new Counter(15, 'Prepare for ring rows'),
  new Counter('stopwatch', 'Ring rows set 1'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter('stopwatch', 'Ring rows set 2'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter('stopwatch', 'Ring rows set 3'),
];

const frontPlanks = [
  new Counter(15, 'Prepare for front planks'),
  new Counter(40, 'Front plank for {{remains}} seconds, set 1'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter(40, 'Front plank for {{remains}} seconds, set 2'),
  new Counter(60, 'Rest for {{remains}} seconds'),
  new Counter(40, 'Front plank for {{remains}} seconds, set 3'),
];

const barHangs = [
  new Counter(15, 'Prepare for bar hangs'),
  new Counter(25, 'Bar hang for {{remains}} seconds'),
];

export const timelines = [
  new Timeline('Pre-run lower back warmup', [
    new Phrase('Starting pre-run lower back warmup routine'),
    new Counter(20, 'Prepare for cat-cow stretch'),
    new Counter(60, 'Cat-cow stretch for {{remains}} seconds'),
    new Counter(5, 'Prepare bird-dog stretch'),
    new Counter(15, 'Bird-dog stretch for {{remains}} seconds'),
    new Counter(15, 'Switch sides'),
    new Counter(15, 'Switch sides'),
    new Counter(15, 'Switch sides'),
    new Counter(15, 'Prepare for child\'s pose'),
    new Counter(60, 'Child\'s pose for {{remains}} seconds'),
    new Counter(20, 'Prepare for standing hip circles'),
    new Counter(15, 'Standing hip circles for {{remains}} seconds'),
    new Counter(15, 'Switch directions'),
    new Counter(15, 'Switch sides'),
    new Counter(15, 'Switch directions'),
    new Phrase('Great! You are ready for your run!'),
  ]),
  new Timeline('Long Stretching Routine', [
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
    new Counter(45, 'Figure four stretch for {{remains}} seconds'),
    new Counter(5, 'Switch legs'),
    new Counter(45, 'Figure four stretch for {{remains}} seconds'),

    new Counter(15, 'Prepare for lower back stretch'),
    new Counter(30, 'Lower back stretch for {{remains}} seconds'),
    new Counter(5, 'Switch sides'),
    new Counter(30, 'Lower back stretch for {{remains}} seconds'),
    new Counter(60, 'Cool down and relax'),
    new Counter(20, 'Get ready for meditation'),
    new Counter(60 * 7, 'Meditation time for 7 minutes! Relax and breathe deeply', 'Congratulations! You have completed the long morning stretching routine!'),
  ]),
  new Timeline('Short Stretching Routine', [
    new Counter(10, 'Prepare for calf stretch'),
    new Counter(30, 'Calf stretch for {{remains}} seconds'),
    new Counter(3, 'Switch legs'),
    new Counter(30, 'Calf stretch for {{remains}} seconds'),

    new Counter(15, 'Prepare for supta virasana'),
    new Counter(20, 'Supta virasana for {{remains}} seconds'),

    new Counter(15, 'Prepare for hip flexor stretch'),
    new Counter(30, 'Hip flexor stretch for {{remains}} seconds'),
    new Counter(15, 'Switch legs'),
    new Counter(30, 'Hip flexor stretch for {{remains}} seconds'),

    new Counter(20, 'Prepare for front split'),
    new Counter(30, 'Front split for {{remains}} seconds'),
    new Counter(15, 'Switch legs'),
    new Counter(30, 'Front split for {{remains}} seconds'),

    new Counter(15, 'Prepare for seated forward bend'),
    new Counter(30, 'Seated forward bend for {{remains}} seconds'),

    new Counter(15, 'Prepare for figure four stretch'),
    new Counter(30, 'Figure four stretch for {{remains}} seconds'),
    new Counter(5, 'Switch legs'),
    new Counter(30, 'Figure four stretch for {{remains}} seconds'),
    new Counter(60, 'Cool down and relax'),
    new Counter(20, 'Get ready for meditation'),
    new Counter(60 * 4, 'Meditation time for 4 minutes! Relax and breathe deeply', 'Congratulations! You have completed the short morning  stretching routine!'),
  ]),
  new Timeline('Monday Workout', [
    new Phrase('Starting Monday workout routine'),
    ...squats,
    new Counter(60, 'Relax and prepare for next exercise'),
    ...kneePushUps,
    new Phrase('Great job! You have completed the Monday workout!'),
  ]),
  new Timeline('Tuesday Workout', [
    new Phrase('Starting Tuesday workout routine'),
    ...ringRows,
    new Counter(60, 'Relax and prepare for next exercise'),
    ...frontPlanks,
    new Counter(60, 'Relax and prepare for next exercise'),
    ...barHangs,
    new Phrase('Great job! You have completed the Tuesday workout!'),
  ]),
  new Timeline('Wednesday Workout', [
    new Phrase('Starting Wednesday workout routine'),
    ...squats,
    new Counter(60, 'Relax and prepare for next exercise'),
    ...gluteBridges,
    new Phrase('Great job! You have completed the Wednesday workout!'),
  ]),
  new Timeline('Thursday Workout', [
    new Phrase('Starting Thursday workout routine'),
    ...kneePushUps,
    new Counter(60, 'Relax and prepare for next exercise'),
    new Counter(15, 'Prepare for side planks'),
    new Counter(30, 'Side plank for {{remains}} seconds, set 1'),
    new Counter(5, 'Switch sides'),
    new Counter(30, 'Side plank for {{remains}} seconds, set 1'),
    new Counter(30, 'Rest for {{remains}} seconds'),
    new Counter(30, 'Side plank for {{remains}} seconds, set 2'),
    new Counter(5, 'Switch sides'),
    new Counter(30, 'Side plank for {{remains}} seconds, set 2'),
    new Counter(30, 'Rest for {{remains}} seconds'),
    new Counter(30, 'Side plank for {{remains}} seconds, set 3'),
    new Counter(5, 'Switch sides'),
    new Counter(30, 'Side plank for {{remains}} seconds, set 3', 'Awesome! You have completed the morning workout!'),
  ]),
  new Timeline('Friday Workout', [
    ...squats,
    new Counter(60, 'Relax and prepare for next exercise'),
    ...ringRows,
    new Phrase('Great job! You have completed the Friday workout!'),
  ]),
  new Timeline('Saturday Workout', [
    new Phrase('Starting Saturday workout routine'),
    ...kneePushUps,
    new Counter(60, 'Relax and prepare for next exercise'),
    ...gluteBridges,
    new Phrase('Great job! You have completed the Saturday workout!'),
  ]),
];
