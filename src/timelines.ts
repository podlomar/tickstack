import { Counter, Phrase, Sound, Timeline, TimelineElement } from './timers';

interface Exercise {
  name: string;
  sets: TimelineElement[];
}

const create3setsExercise = (name: string): Exercise => ({
  name,
  sets: [
    new Counter('stopwatch', `${name} set 1`),
    new Counter(60, 'Rest for {{remains}} seconds'),
    new Counter('stopwatch', `${name} set 2`),
    new Counter(90, 'Rest for {{remains}} seconds'),
    new Counter('stopwatch', `${name} set 3`),
  ]
});

const kneePushUps = create3setsExercise('Knee Push-Ups');
const squats = create3setsExercise('Squats');
const ringRows = create3setsExercise('Ring Rows');
const bicepCurls = create3setsExercise('Bicep Curls');
const reverseLunges = create3setsExercise('Reverse Lunges');

const gluteBridges: Exercise = {
  name: 'Glute Bridges',
  sets: [
    new Counter(55, 'Glute bridge for {{remains}} seconds'),
    new Counter(55, 'Rest for {{remains}} seconds'),
    new Counter(55, 'Glute bridge for {{remains}} seconds'),
    new Counter(55, 'Rest for {{remains}} seconds'),
    new Counter(55, 'Glute bridge for {{remains}} seconds'),
  ],
};

const pikeHold: Exercise = {
  name: 'Pike Hold',
  sets: [
    new Counter(60, 'Pike hold for {{remains}} seconds'),
  ],
};

const createSidePlanks = (duration: number, rest: number): Exercise => ({
  name: 'Side Planks',
  sets: [
    new Counter(duration, 'Side plank for {{remains}} seconds, set 1'),
    new Counter(8, 'Switch sides'),
    new Counter(duration, 'Side plank for {{remains}} seconds, set 1'),
    new Counter(rest, 'Rest for {{remains}} seconds'),
    new Counter(duration, 'Side plank for {{remains}} seconds, set 2'),
    new Counter(8, 'Switch sides'),
    new Counter(duration, 'Side plank for {{remains}} seconds, set 2'),
    new Counter(rest * 1.5, 'Rest for {{remains}} seconds'),
    new Counter(duration, 'Side plank for {{remains}} seconds, set 3'),
    new Counter(8, 'Switch sides'),
    new Counter(duration, 'Side plank for {{remains}} seconds, set 3'),
  ]
});

const sidePlanks = createSidePlanks(40, 40);

const createDailyRoutine = (
  title: string, day: 'odd' | 'even', ...exercises: Exercise[]
) => {
  const elements: TimelineElement[] = [
    new Counter(15, `Get ready for ${exercises[0].name}`),
    ...exercises[0].sets,
  ];

  for (const exercise of exercises.slice(1)) {
    elements.push(new Counter(60, `Rest for {{remains}} seconds and prepare for ${exercise.name}`));
    elements.push(...exercise.sets);
  }

  const exerciseNames = exercises.slice(0, -1).map(e => e.name).join(', ') + ' and ' + exercises.at(-1)!.name;

  const stableExercises = day === 'odd'
    ? [
      new Counter(60, 'Rest for {{remains}} seconds and prepare for front plank'),
      new Counter(60, 'Front plank for {{remains}} seconds'),
      new Counter(60, 'Rest for {{remains}} seconds and prepare for ring hold'),
      new Counter(20, 'Ring support for {{remains}} seconds'),
      new Counter(30, 'Rest for {{remains}} seconds and prepare for bar hang'),
      new Counter(35, 'Passive bar hang for {{remains}} seconds'),
    ] : [
      new Counter(60, 'Rest for {{remains}} seconds and prepare for front plank'),
      new Counter(60, 'Hollow body hold for {{remains}} seconds'),
      new Counter(60, 'Rest for {{remains}} seconds and prepare for ring hold'),
      new Counter(20, 'Ring support for {{remains}} seconds'),
      new Counter(30, 'Rest for {{remains}} seconds and prepare for bar hang'),
      new Counter(35, 'Active bar hang for {{remains}} seconds'),
    ];

  return new Timeline(
    title,
    exerciseNames,
    [
      new Phrase(`Starting ${title} routine with ${exerciseNames}`),
      ...elements,
      ...stableExercises,
      new Phrase(`Great job! You have completed the ${title} routine`),
    ]
  );
};

const exerciseToTimeline = (exercise: Exercise): Timeline =>
  new Timeline(exercise.name, 'Individual exercise', [
    new Counter(20, `Get ready for ${exercise.name}`),
    ...exercise.sets,
    new Phrase(`${exercise.name} complete!`),
  ]);

export const exercises = [
  squats,
  kneePushUps,
  ringRows,
  bicepCurls,
  reverseLunges,
  gluteBridges,
  pikeHold,
  sidePlanks,
].map(exerciseToTimeline);

const makeTimer = (seconds: number): Timeline => {
  const label = seconds < 60
    ? `${seconds}s`
    : seconds % 60 === 0
      ? `${seconds / 60} min`
      : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return new Timeline(label, 'Countdown timer', [
    new Counter(seconds, '{{remains}} seconds remaining'),
  ]);
};

export const timers = [60, 90, 120, 180, 300, 600, 900].map(makeTimer);

export const timelines = [
  new Timeline('Pre-run', 'Lower back warmup', [
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
  new Timeline('Long Stretching', 'Full lower body routine', [
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
  new Timeline('Short Stretching', 'Lower body routine', [
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
  createDailyRoutine('Monday Workout', 'odd', squats, kneePushUps, reverseLunges),
  createDailyRoutine('Tuesday Workout', 'even', ringRows, sidePlanks, pikeHold),
  createDailyRoutine('Wednesday Workout', 'odd', squats, gluteBridges, bicepCurls),
  createDailyRoutine('Thursday Workout', 'even', kneePushUps, sidePlanks, reverseLunges),
  createDailyRoutine('Friday Workout', 'odd', squats, ringRows, pikeHold),
  createDailyRoutine('Saturday Workout', 'even', kneePushUps, gluteBridges, bicepCurls),
  new Timeline('Short Workout Routine', 'Quick full body workout', [
    new Counter(15, 'Prepare for squats'),
    new Counter('stopwatch', 'Squats set'),
    new Counter(60, 'Rest for {{remains}} seconds and prepare for knee push-ups'),
    new Counter('stopwatch', 'Knee push-ups set'),
    new Counter(60, 'Rest for {{remains}} seconds and prepare for front plank'),
    new Counter(45, 'Front plank for {{remains}} seconds'),
    new Counter(60, 'Rest for {{remains}} seconds and prepare for bar hang'),
    new Counter(30, 'Bar hang for {{remains}} seconds'),
    new Phrase('Great job! You have completed the short workout routine!'),
  ]),
  new Timeline('Meditation', 'Quick mindfulness session', [
    new Counter(10, 'Get ready for meditation'),
    new Sound('/sounds/ding.mp3'),
    new Counter(60 * 5),
    new Sound('/sounds/ding.mp3'),
    new Counter(60 * 5),
    new Sound('/sounds/ding.mp3'),
    new Counter(60 * 5),
    new Sound('/sounds/ding.mp3'),
    new Phrase('Well done! You have completed your meditation session.'),
  ]),
];
