const template = (str, args) => {
    return str.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => args[key]);
};
export class Countdown {
    startPhrase;
    endPhrase;
    duration;
    remaining;
    running = false;
    constructor(duration, startPhrase, endPhrase) {
        this.duration = duration;
        this.remaining = duration;
        this.startPhrase = startPhrase;
        this.endPhrase = endPhrase;
    }
    async start() {
        this.remaining = this.duration;
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.startPhrase, { remains: this.remaining });
        const utterStart = new SpeechSynthesisUtterance(template(this.startPhrase, { remains: this.remaining }));
        window.speechSynthesis.speak(utterStart);
        return new Promise((resolve) => {
            utterStart.onend = () => {
                this.running = true;
                resolve();
            };
        });
    }
    tick() {
        if (!this.running) {
            return 'stop';
        }
        this.remaining -= 1;
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = `${this.remaining} seconds`;
        if (this.remaining <= 0) {
            return 'stop';
        }
        return 'continue';
    }
    async finish() {
        this.running = false;
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.endPhrase ?? '0', { remains: 0 });
        if (this.endPhrase !== undefined) {
            const utterFinish = new SpeechSynthesisUtterance(template(this.endPhrase, { remains: 0 }));
            window.speechSynthesis.speak(utterFinish);
            return new Promise((resolve) => {
                utterFinish.onend = () => {
                    resolve();
                };
            });
        }
        return;
    }
    isRunning() {
        return this.running;
    }
}
export class Timeline {
    elements = [];
    currentIndex = 0;
    constructor(elements) {
        this.elements = elements;
    }
    async runElement(element) {
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
    async run() {
        this.currentIndex = 0;
        while (this.currentIndex < this.elements.length) {
            const element = this.elements[this.currentIndex];
            await this.runElement(element);
            this.currentIndex++;
        }
    }
}
