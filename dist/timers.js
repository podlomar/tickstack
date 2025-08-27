const template = (str, args) => {
    return str.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => args[key]);
};
export class Countdown {
    duration;
    startPhrase;
    endPhrase;
    timer;
    constructor(duration, startPhrase, endPhrase) {
        this.duration = duration;
        this.timer = new Timer();
        this.timer.onTick = this.handleTick.bind(this);
        this.startPhrase = startPhrase;
        this.endPhrase = endPhrase;
    }
    async run() {
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.startPhrase, { remains: this.duration });
        const utterStart = new SpeechSynthesisUtterance(template(this.startPhrase, { remains: this.duration }));
        window.speechSynthesis.speak(utterStart);
        return new Promise((resolve) => {
            utterStart.onend = async () => {
                await this.timer.run();
                resolve();
            };
        });
    }
    stop() {
        this.timer.stop();
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.endPhrase ?? '0', { remains: 0 });
        if (this.endPhrase !== undefined) {
            const utterFinish = new SpeechSynthesisUtterance(template(this.endPhrase, { remains: 0 }));
            window.speechSynthesis.speak(utterFinish);
        }
    }
    getDuration() {
        return this.duration;
    }
    handleTick(elapsed) {
        const remaining = this.duration - elapsed;
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = template(this.startPhrase, { remains: remaining });
        if (remaining <= 0) {
            this.stop();
        }
    }
}
export class Stopwatch {
    timer;
    startPhrase;
    endPhrase;
    constructor(startPhrase, endPhrase) {
        this.timer = new Timer();
        this.timer.onFrame = this.handleFrame.bind(this);
        this.startPhrase = startPhrase;
        this.endPhrase = endPhrase;
    }
    async run() {
        const countdownElement = document.getElementById('countdown');
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
    stop() {
        this.timer.stop();
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = '00:00';
    }
    getDuration() {
        return null;
    }
    handleFrame(elapsed) {
        const minutes = Math.floor(elapsed / 60);
        const seconds = Math.floor(elapsed % 60);
        const countdownElement = document.getElementById('countdown');
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds
            .toString()
            .padStart(2, '0')}`;
    }
}
export class Timeline {
    elements = [];
    currentIndex = 0;
    totalDuration = 0;
    constructor(elements) {
        this.elements = elements;
        this.totalDuration = elements.reduce((sum, element) => {
            return sum + (element.getDuration() ?? 0);
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
    next() {
        if (this.currentIndex < this.elements.length) {
            this.elements[this.currentIndex].stop();
        }
    }
}
export class Timer {
    onTick = () => { };
    onFrame = () => { };
    running = false;
    constructor() { }
    async run() {
        this.running = true;
        const startTime = performance.now() / 1000;
        let lastTickTime = startTime;
        return new Promise((resolve) => {
            const update = (time) => {
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
    stop() {
        this.running = false;
        this.onTick = () => { };
        this.onFrame = () => { };
    }
}
;
