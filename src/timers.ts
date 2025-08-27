const template = (str: string, args: { [key: string]: any }) => {
  return str.replace(
    /\{\{([a-zA-Z0-9_]+)\}\}/g,
    (_, key: string) => args[key]
  );
};

interface TimelineElement {
  run(): Promise<void>;
  stop(): void;
  getDuration(): number | null;
}

export class Countdown implements TimelineElement {
  private duration: number;
  private startPhrase: string;
  private endPhrase?: string;
  private timer: Timer;

  public constructor(
    duration: number,
    startPhrase: string,
    endPhrase?: string,
  ) {
    this.duration = duration;
    this.timer = new Timer();
    this.timer.onTick = this.handleTick.bind(this);
    this.startPhrase = startPhrase;
    this.endPhrase = endPhrase;
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

  public getDuration(): number {
    return this.duration;
  }

  private handleTick(elapsed: number): void {
    const remaining = this.duration - elapsed;
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.startPhrase, { remains: remaining });

    if (remaining <= 0) {
      this.stop();
    }
  }
}

export class Stopwatch implements TimelineElement {
  private timer: Timer;
  private startPhrase: string;
  private endPhrase?: string;

  public constructor(startPhrase: string, endPhrase?: string) {
    this.timer = new Timer();
    this.timer.onFrame = this.handleFrame.bind(this);
    this.startPhrase = startPhrase;
    this.endPhrase = endPhrase;
  }

  public async run(): Promise<void> {
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = this.startPhrase;
    const utterStart = new SpeechSynthesisUtterance(this.startPhrase);
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
    countdownElement.textContent = '00:00';
  }

  public getDuration(): number | null {
    return null;
  }

  private handleFrame(elapsed: number): void {
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
}

export class Timeline {
  private elements: TimelineElement[] = [];
  private currentIndex: number = 0;
  private totalDuration: number = 0;

  public constructor(elements: TimelineElement[]) {
    this.elements = elements;
    this.totalDuration = elements.reduce((sum, element) => {
      return sum + (element.getDuration() ?? 0);
    }, 0);
  }

  public async run(): Promise<void> {
    this.currentIndex = 0;

    while (this.currentIndex < this.elements.length) {
      const element = this.elements[this.currentIndex];
      await element.run();
      this.currentIndex++;
    }
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
  public onFrame: (remaining: number) => void = () => { };

  private running: boolean = false;

  public constructor() { }

  public async run(): Promise<void> {
    this.running = true;
    const startTime = performance.now() / 1000;
    let lastTickTime = startTime;

    return new Promise((resolve) => {
      const update = (time: number): void => {
        if (!this.running) {
          resolve();
          return;
        }

        const runningTime = time / 1000 - startTime;
        this.onFrame(runningTime);

        if (time - lastTickTime >= 1000) {
          this.onTick(runningTime);
          lastTickTime = time;
        }

        window.requestAnimationFrame(update);
      };

      window.requestAnimationFrame(update);
    });
  }

  public stop(): void {
    this.running = false;
    this.onTick = () => { };
    this.onFrame = () => { };
  }
};
