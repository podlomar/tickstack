const template = (str: string, args: { [key: string]: any }) => {
  return str.replace(
    /\{\{([a-zA-Z0-9_]+)\}\}/g,
    (_, key: string) => args[key]
  );
};

interface TimelineElement {
  start(): Promise<void>;
  tick(): 'continue' | 'stop';
  finish(): Promise<void>;
  isRunning(): boolean;
}

export class Countdown implements TimelineElement {
  private startPhrase: string;
  private endPhrase?: string;
  private duration: number;
  private remaining: number;
  private running: boolean = false;

  public constructor(
    duration: number,
    startPhrase: string,
    endPhrase?: string,
  ) {
    this.duration = duration;
    this.remaining = duration;
    this.startPhrase = startPhrase;
    this.endPhrase = endPhrase;
  }

  public async start(): Promise<void> {
    this.remaining = this.duration;
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.startPhrase, { remains: this.remaining });

    const utterStart = new SpeechSynthesisUtterance(
      template(this.startPhrase, { remains: this.remaining })
    );
    window.speechSynthesis.speak(utterStart);

    return new Promise((resolve) => {
      utterStart.onend = () => {
        this.running = true;
        resolve();
      };
    });
  }

  public tick(): 'continue' | 'stop' {
    if (!this.running) {
      return 'stop';
    }

    this.remaining -= 1;

    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = `${this.remaining} seconds`;

    if (this.remaining <= 0) {
      return 'stop';
    }

    return 'continue';
  }

  public async finish(): Promise<void> {
    this.running = false;
    const countdownElement = document.getElementById('countdown')!;
    countdownElement.textContent = template(this.endPhrase ?? '0', { remains: 0 });

    if (this.endPhrase !== undefined) {
      const utterFinish = new SpeechSynthesisUtterance(
        template(this.endPhrase, { remains: 0 })
      );
      window.speechSynthesis.speak(utterFinish);

      return new Promise((resolve) => {
        utterFinish.onend = () => {
          resolve();
        };
      });
    }

    return;
  }

  public isRunning(): boolean {
    return this.running;
  }
}

export class Timeline {
  private elements: TimelineElement[] = [];
  private currentIndex: number = 0;

  public constructor(elements: TimelineElement[]) {
    this.elements = elements;
  }

  public async runElement(element: TimelineElement): Promise<void> {
    await element.start();

    return new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        const action = element.tick();
        if (action === 'stop') {
          clearInterval(intervalId);
          await element.finish();
          resolve();
        }
      }, 1000);
    });
  }

  public async run(): Promise<void> {
    this.currentIndex = 0;

    while (this.currentIndex < this.elements.length) {
      const element = this.elements[this.currentIndex];
      await this.runElement(element);
      this.currentIndex++;
    }
  }
}
