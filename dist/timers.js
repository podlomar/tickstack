const template = (str, args) => {
    return str.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => args[key]);
};
export class Counter {
    duration;
    startPhrase;
    endPhrase;
    timer;
    constructor(duration, startPhrase, endPhrase) {
        this.duration = duration;
        this.timer = new Timer();
        this.timer.onTick = this.handleTick.bind(this);
        this.timer.onFrame = this.handleFrame.bind(this);
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
        const time = this.duration === 'stopwatch' ? elapsed : this.duration - elapsed;
        const displayTime = `${Math.round(time)}s`;
        const countdownElement = document.querySelector('#timer text');
        countdownElement.textContent = displayTime;
        if (this.duration !== 'stopwatch' && elapsed >= this.duration) {
            this.stop();
        }
    }
    handleFrame(elapsed) {
        const ratio = this.duration === 'stopwatch' ? 0 : elapsed / this.duration;
        const progressElement = document.querySelector('#progress');
        const length = progressElement.getTotalLength();
        progressElement.style.strokeDasharray = `${length}`;
        progressElement.style.strokeDashoffset = `${length * (1 - ratio)}`;
    }
}
export class Timeline {
    title;
    elements = [];
    currentIndex = 0;
    totalDuration = 0;
    constructor(title, elements) {
        this.title = title;
        this.elements = elements;
        this.totalDuration = elements.reduce((sum, element) => {
            const duration = element.getDuration();
            return sum + (duration === 'stopwatch' ? 0 : duration);
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
    getTitle() {
        return this.title;
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
