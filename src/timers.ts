const template = (str: string, args: { [key: string]: any }) => {
  return str.replace(
    /\{\{([a-zA-Z0-9_]+)\}\}/g,
    (_, key: string) => args[key]
  );
};

export interface CountdownState {
  type: 'countdown';
  running: boolean;
  text?: string;
  remaining: number;
  progressRatio: number;
}

export interface StopwatchState {
  type: 'stopwatch';
  running: boolean;
  text?: string;
  elapsed: number;
}

export interface SpeechState {
  type: 'speech';
  running: boolean;
  text?: string;
}

export interface SoundState {
  type: 'sound';
  running: boolean;
  text?: string;
}

export type TimerState = CountdownState | StopwatchState | SpeechState | SoundState;

type Duration = number | 'stopwatch';

export interface TimelineElement {
  run(): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
  getDuration(): Duration;
  onStateChange(callback: (state: TimerState) => void): void;
}

export class Counter implements TimelineElement {
  private duration: Duration;
  private startPhrase?: string;
  private endPhrase?: string;
  private timer: Timer;
  private stateCallback: (state: TimerState) => void = () => { };

  public constructor(
    duration: Duration,
    startPhrase?: string,
    endPhrase?: string,
  ) {
    this.duration = duration;
    this.timer = new Timer();
    this.timer.onTick = (elapsed, paused) => this.handleTick(elapsed, paused);
    this.startPhrase = startPhrase;
    this.endPhrase = endPhrase;
  }

  public onStateChange(callback: (state: TimerState) => void): void {
    this.stateCallback = callback;
  }

  public async run(): Promise<void> {
    const phrase = this.startPhrase === undefined ? undefined : template(this.startPhrase, { remains: this.duration });

    this.stateCallback({
      type: 'speech',
      running: true,
      text: phrase,
    });

    if (phrase !== undefined) {
      const utterStart = new SpeechSynthesisUtterance(phrase);
      window.speechSynthesis.speak(utterStart);

      return new Promise((resolve) => {
        utterStart.onend = async () => {
          await this.timer.run();
          resolve();
        };
      });
    }

    await this.timer.run();
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

  public pause(): void {
    this.timer.pause();
  }

  public resume(): void {
    this.timer.resume();
  }

  public getDuration(): Duration {
    return this.duration;
  }

  private handleTick(elapsed: number, paused: boolean): void {
    if (this.duration === 'stopwatch') {
      this.stateCallback({
        type: 'stopwatch',
        running: !paused,
        text: this.startPhrase,
        elapsed,
      });
    } else {
      const remaining = Math.max(this.duration - elapsed, 0);
      const ratio = elapsed / this.duration;
      this.stateCallback({
        type: 'countdown',
        running: !paused,
        text: this.startPhrase === undefined ? undefined : template(this.startPhrase, { remains: Math.ceil(remaining) }),
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
  private paused: boolean = false;

  public constructor(phrase: string) {
    this.phrase = phrase;
  }

  public onStateChange(callback: (state: TimerState) => void): void {
    this.stateCallback = callback;
  }

  public async run(): Promise<void> {
    this.paused = false;
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

  public pause(): void {
    this.paused = true;
    window.speechSynthesis.pause();
    this.stateCallback({
      type: 'speech',
      running: false,
      text: this.phrase,
    });
  }

  public resume(): void {
    this.paused = false;
    window.speechSynthesis.resume();
    this.stateCallback({
      type: 'speech',
      running: true,
      text: this.phrase,
    });
  }

  public getDuration(): Duration {
    return 0;
  }
}

export class Sound implements TimelineElement {
  private audio: HTMLAudioElement;
  private stateCallback: (state: TimerState) => void = () => { };

  public constructor(audioSrc: string) {
    this.audio = new Audio(audioSrc);
  }

  public onStateChange(callback: (state: TimerState) => void): void {
    this.stateCallback = callback;
  }

  public async run(): Promise<void> {
    this.stateCallback({
      type: 'sound',
      running: true,
      text: `Playing sound`,
    });

    return new Promise((resolve) => {
      this.audio.onended = () => {
        resolve();
      };
      this.audio.play();
    });
  }

  public stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  public pause(): void {
    this.audio.pause();
    this.stateCallback({
      type: 'sound',
      running: false,
      text: `Playing sound`,
    });
  }

  public resume(): void {
    this.audio.play();
    this.stateCallback({
      type: 'sound',
      running: true,
      text: `Playing sound`,
    });
  }

  public getDuration(): Duration {
    return 0;
  }
}

export class Timeline {
  private title: string;
  private subtitle: string;
  private elements: TimelineElement[] = [];
  private currentIndex: number = 0;
  private totalDuration: number = 0;
  private stateCallback: (state: TimerState) => void = () => { };
  private wakeLock: WakeLockSentinel | null = null;
  private _running: boolean = false;
  private _paused: boolean = false;

  public constructor(
    title: string, subtitle: string, elements: TimelineElement[]
  ) {
    this.title = title;
    this.subtitle = subtitle;
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

    this._running = true;
    this._paused = false;
    this.currentIndex = 0;
    while (this.currentIndex < this.elements.length) {
      const element = this.elements[this.currentIndex];
      element.onStateChange(this.stateCallback);
      await element.run();
      this.currentIndex++;
    }

    this._running = false;
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

  public getSubtitle(): string {
    return this.subtitle;
  }

  public getTotalDuration(): number {
    return this.totalDuration;
  }

  public next(): void {
    if (this.currentIndex < this.elements.length) {
      this.elements[this.currentIndex].stop();
    }
  }

  public pause(): void {
    if (this.currentIndex < this.elements.length) {
      this._paused = true;
      this.elements[this.currentIndex].pause();
    }
  }

  public resume(): void {
    if (this.currentIndex < this.elements.length) {
      this._paused = false;
      this.elements[this.currentIndex].resume();
    }
  }

  public running(): boolean {
    return this._running && !this._paused;
  }
}

export class Timer {
  public onTick: (elapsed: number, paused: boolean) => void = () => { };
  private resolve: (() => void) | null = null;
  private intervalId: number | null = null;
  private elapsed: number = 0;
  private paused: boolean = false;

  public constructor() { }

  public async run(): Promise<void> {
    return new Promise((resolve) => {
      this.elapsed = 0;
      this.paused = false;
      this.onTick(this.elapsed, this.paused);

      this.intervalId = window.setInterval(() => {
        if (!this.paused) {
          this.elapsed++;
        }
        this.onTick(this.elapsed, this.paused);
      }, 1000);

      this.resolve = () => {
        if (this.intervalId !== null) {
          window.clearInterval(this.intervalId);
          this.intervalId = null;
        }
        this.resolve = null;
        resolve();
      };
    });
  }

  public stop(): void {
    this.resolve?.();
  }

  public pause(): void {
    this.paused = true;
    this.onTick(this.elapsed, this.paused);
  }

  public resume(): void {
    this.paused = false;
    this.onTick(this.elapsed, this.paused);
  }
}
