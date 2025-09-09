const template = (str: string, args: { [key: string]: any }) => {
  return str.replace(
    /\{\{([a-zA-Z0-9_]+)\}\}/g,
    (_, key: string) => args[key]
  );
};

export interface CountdownState {
  type: 'countdown';
  running: boolean;
  text: string;
  remaining: number;
  progressRatio: number;
}

export interface StopwatchState {
  type: 'stopwatch';
  running: boolean;
  text: string;
  elapsed: number;
}

export interface SpeechState {
  type: 'speech';
  running: boolean;
  text: string;
}

export type TimerState = CountdownState | StopwatchState | SpeechState;

type Duration = number | 'stopwatch';

export interface TimelineElement {
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
    const phrase = template(this.startPhrase, { remains: this.duration });

    this.stateCallback({
      type: 'speech',
      running: true,
      text: phrase,
    });

    const utterStart = new SpeechSynthesisUtterance(phrase);
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
    if (this.duration === 'stopwatch') {
      this.stateCallback({
        type: 'stopwatch',
        running: false,
        text: this.startPhrase,
        elapsed,
      });
    } else {
      const remaining = Math.max(this.duration - elapsed, 0);
      const ratio = elapsed / this.duration;
      this.stateCallback({
        type: 'countdown',
        running: true,
        text: template(this.startPhrase, { remains: Math.ceil(remaining) }),
        remaining,
        progressRatio: Math.min(ratio, 1),
      });
    }

    if (this.duration !== 'stopwatch' && elapsed >= this.duration) {
      this.stop();
    }
  }
}

export class Phrase implements TimelineElement {
  private phrase: string;
  private stateCallback: (state: TimerState) => void = () => { };

  public constructor(phrase: string) {
    this.phrase = phrase;
  }

  public onStateChange(callback: (state: TimerState) => void): void {
    this.stateCallback = callback;
  }

  public async run(): Promise<void> {
    this.stateCallback({
      type: 'speech',
      running: true,
      text: this.phrase,
    });

    const utterance = new SpeechSynthesisUtterance(this.phrase);
    const now = performance.now();
    window.speechSynthesis.speak(utterance);

    return new Promise((resolve) => {
      utterance.onend = (e) => {
        const duration = e.elapsedTime / 1000;
        console.log(`Spoken phrase "${this.phrase}" took ${duration} seconds`);
        resolve();
      };
    });
  }

  public stop(): void {
    window.speechSynthesis.cancel();
  }

  public getDuration(): Duration {
    return 0;
  }
}

export class Timeline {
  private title: string;
  private elements: TimelineElement[] = [];
  private currentIndex: number = 0;
  private totalDuration: number = 0;
  private stateCallback: (state: TimerState) => void = () => { };
  private wakeLock: WakeLockSentinel | null = null;

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
    await this.requestWakeLock();

    this.currentIndex = 0;
    while (this.currentIndex < this.elements.length) {
      const element = this.elements[this.currentIndex];
      element.onStateChange(this.stateCallback);
      await element.run();
      this.currentIndex++;
    }

    this.releaseWakeLock();
  }

  private async requestWakeLock(): Promise<void> {
    if ('wakeLock' in navigator) {
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active');
    }
  }

  private releaseWakeLock(): void {
    if (this.wakeLock !== null) {
      this.wakeLock.release();
      this.wakeLock = null;
      console.log('Wake Lock is released');
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
