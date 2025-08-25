const template = (str, args) => {
    return str.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => args[key]);
};
export class Countdown {
    startPhrase;
    endPhrase;
    timer;
    constructor(duration, startPhrase, endPhrase) {
        this.timer = new Timer(duration);
        this.timer.onTick = this.handleTick.bind(this);
        this.timer.onFinish = this.handleFinish.bind(this);
        this.startPhrase = startPhrase;
        this.endPhrase = endPhrase;
    }
    async run() {
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.startPhrase, { remains: this.timer.getRemaining() });
        const utterStart = new SpeechSynthesisUtterance(template(this.startPhrase, { remains: this.timer.getRemaining() }));
        window.speechSynthesis.speak(utterStart);
        return new Promise((resolve) => {
            utterStart.onend = async () => {
                await this.timer.run();
                resolve();
            };
        });
    }
    getDuration() {
        return this.timer.getDuration();
    }
    handleTick(remaining) {
        console.log(`Remaining time: ${remaining} ms`);
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.startPhrase, { remains: remaining });
    }
    handleFinish() {
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.endPhrase ?? '0', { remains: 0 });
        if (this.endPhrase !== undefined) {
            const utterFinish = new SpeechSynthesisUtterance(template(this.endPhrase, { remains: 0 }));
            window.speechSynthesis.speak(utterFinish);
        }
    }
}
export class Timeline {
    elements = [];
    currentIndex = 0;
    totalDuration = 0;
    constructor(elements) {
        this.elements = elements;
        this.totalDuration = elements.reduce((sum, element) => {
            return sum + element.getDuration();
        }, 0);
    }
    async run() {
        this.currentIndex = 0;
        while (this.currentIndex < this.elements.length) {
            const element = this.elements[this.currentIndex];
            await element.run();
            this.currentIndex++;
        }
    }
    getTotalDuration() {
        return this.totalDuration;
    }
}
export class Timer {
    duration;
    remaining;
    onTick = () => { };
    onFrame = () => { };
    onFinish = () => { };
    constructor(duration) {
        this.duration = duration;
        this.remaining = duration;
    }
    async run() {
        const startTime = performance.now() / 1000;
        let lastTickTime = startTime;
        return new Promise((resolve) => {
            const update = (time) => {
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
    getDuration() {
        return this.duration;
    }
    getRemaining() {
        return this.remaining;
    }
}
;
