const template = (str: string, args: { [key: string]: any }) => {
  return str.replace(
    /\{\{([a-zA-Z0-9_]+)\}\}/g,
    (_, key: string) => args[key]
  );
};

export interface TimerState {
  running: boolean;
  text: string;
  displayTime: string;
  progressRatio: number;
}

type Duration = number | 'stopwatch';

interface TimelineElement {
  run(): Promise<void>;
  stop(): void;
  getDuration(): Duration;
  onStateChange(callback: (state: TimerState) => void): void;
}

export class Counter implements TimelineElement {
  private duration: Duration;
  private startPhrase: string;
  private endPhrase?: string;
  private timer: Timer;
  private stateCallback: (state: TimerState) => void = () => { };

  public constructor(
    duration: Duration,
    startPhrase: string,
    endPhrase?: string,
  ) {
    this.duration = duration;
    this.timer = new Timer();
    this.timer.onTick = this.handleTick.bind(this);
    this.startPhrase = startPhrase;
    this.endPhrase = endPhrase;
  }

  public onStateChange(callback: (state: TimerState) => void): void {
    this.stateCallback = callback;
  }

  public async run(): Promise<void> {
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.startPhrase, { remains: this.duration });

    const utterStart = new SpeechSynthesisUtterance(
      template(this.startPhrase, { remains: this.duration })
    );
    window.speechSynthesis.speak(utterStart);

    return new Promise((resolve) => {
      utterStart.onend = async () => {
        await this.timer.run();
        resolve();
      };
    });
  }

  public stop(): void {
    this.timer.stop();
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.endPhrase ?? '0', { remains: 0 });

    if (this.endPhrase !== undefined) {
      const utterFinish = new SpeechSynthesisUtterance(
        template(this.endPhrase, { remains: 0 })
      );
      window.speechSynthesis.speak(utterFinish);
    }
  }

  public getDuration(): Duration {
    return this.duration;
  }

  private handleTick(elapsed: number): void {
    const time = this.duration === 'stopwatch' ? elapsed : this.duration - elapsed;

    const displayTime = `${Math.round(time)}s`;
    const ratio = this.duration === 'stopwatch' ? 0 : elapsed / this.duration;

    this.stateCallback({
      running: true,
      text: template(this.startPhrase, { remains: Math.ceil(time) }),
      displayTime,
      progressRatio: Math.min(ratio, 1),
    });

    // const progressElement = document.querySelector('#progress') as SVGGeometryElement
    // const length = progressElement.getTotalLength();
    // progressElement.style.strokeDasharray = `${length}`;
    // progressElement.style.strokeDashoffset = `${length * (1 - ratio)}`;

    if (this.duration !== 'stopwatch' && elapsed >= this.duration) {
      this.stop();
    }
  }
}

export class Timeline {
  private title: string;
  private elements: TimelineElement[] = [];
  private currentIndex: number = 0;
  private totalDuration: number = 0;
  private stateCallback: (state: TimerState) => void = () => { };

  public constructor(title: string, elements: TimelineElement[]) {
    this.title = title;
    this.elements = elements;
    this.totalDuration = elements.reduce((sum, element) => {
      const duration = element.getDuration();
      return sum + (duration === 'stopwatch' ? 0 : duration);
    }, 0);
  }

  public onStateChange(callback: (state: TimerState) => void): void {
    this.stateCallback = callback;
  }

  public async run(): Promise<void> {
    this.currentIndex = 0;
    while (this.currentIndex < this.elements.length) {
      const element = this.elements[this.currentIndex];
      element.onStateChange(this.stateCallback);
      await element.run();
      this.currentIndex++;
    }
  }

  public getTitle(): string {
    return this.title;
  }

  public getTotalDuration(): number {
    return this.totalDuration;
  }

  public next(): void {
    if (this.currentIndex < this.elements.length) {
      this.elements[this.currentIndex].stop();
    }
  }
}

export class Timer {
  public onTick: (remaining: number) => void = () => { };
  private resolve: (() => void) | null = null;
  public constructor() { }

  public async run(): Promise<void> {
    return new Promise((resolve) => {
      let elapsed = 0;
      this.onTick(elapsed);

      const intervalId = window.setInterval(() => {
        elapsed++;
        this.onTick(elapsed);
        console.log(elapsed);
      }, 1000);

      this.resolve = () => {
        window.clearInterval(intervalId);
        this.resolve = null;
        resolve();
      };
    });
  }

  public stop(): void {
    this.resolve?.();
  }
};
