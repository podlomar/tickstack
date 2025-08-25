const template = (str: string, args: { [key: string]: any }) => {
  return str.replace(
    /\{\{([a-zA-Z0-9_]+)\}\}/g,
    (_, key: string) => args[key]
  );
};

interface TimelineElement {
  run(): Promise<void>;
  getDuration(): number;
}

export class Countdown implements TimelineElement {
  private startPhrase: string;
  private endPhrase?: string;
  private timer: Timer;

  public constructor(
    duration: number,
    startPhrase: string,
    endPhrase?: string,
  ) {
    this.timer = new Timer(duration);
    this.timer.onTick = this.handleTick.bind(this);
    this.timer.onFinish = this.handleFinish.bind(this);
    this.startPhrase = startPhrase;
    this.endPhrase = endPhrase;
  }

  public async run(): Promise<void> {
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.startPhrase, { remains: this.timer.getRemaining() });

    const utterStart = new SpeechSynthesisUtterance(
      template(this.startPhrase, { remains: this.timer.getRemaining() })
    );
    window.speechSynthesis.speak(utterStart);

    return new Promise((resolve) => {
      utterStart.onend = async () => {
        await this.timer.run();
        resolve();
      };
    });
  }

  public getDuration(): number {
    return this.timer.getDuration();
  }

  private handleTick(remaining: number): void {
    console.log(`Remaining time: ${remaining} ms`);
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.startPhrase, { remains: remaining });
  }

  private handleFinish(): void {
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.endPhrase ?? '0', { remains: 0 });

    if (this.endPhrase !== undefined) {
      const utterFinish = new SpeechSynthesisUtterance(
        template(this.endPhrase, { remains: 0 })
      );
      window.speechSynthesis.speak(utterFinish);
    }
  }
}

export class Timeline {
  private elements: TimelineElement[] = [];
  private currentIndex: number = 0;
  private totalDuration: number = 0;

  public constructor(elements: TimelineElement[]) {
    this.elements = elements;
    this.totalDuration = elements.reduce((sum, element) => {
      return sum + element.getDuration();
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
}

export class Timer {
  private duration: number;
  private remaining: number;

  public onTick: (remaining: number) => void = () => { };
  public onFrame: (remaining: number) => void = () => { };
  public onFinish: () => void = () => { };

  public constructor(duration: number) {
    this.duration = duration;
    this.remaining = duration;
  }

  public async run(): Promise<void> {
    const startTime = performance.now() / 1000;
    let lastTickTime = startTime;

    return new Promise((resolve) => {
      const update = (time: number): void => {
        const runningTime = time / 1000 - startTime;
        this.remaining = this.duration - runningTime;
        this.onFrame(this.remaining);

        if (this.remaining <= 0) {
          this.onFinish();
          resolve();
          return;
        }

        if (time - lastTickTime >= 1000) {
          this.onTick(this.remaining);
          lastTickTime = time;
        }

        window.requestAnimationFrame(update);
      };

      window.requestAnimationFrame(update);
    });
  }

  public getDuration(): number {
    return this.duration;
  }

  public getRemaining(): number {
    return this.remaining;
  }
};
