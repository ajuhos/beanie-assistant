export class SpeechContext {
    private readonly maxLength: number = 100;
    private value = "";
    private commandQueue = [];

    constructor(maxLength = 100) {
        this.maxLength = maxLength
    }

    private reduceValueIfRequired() {
        if(this.value.length > this.maxLength) {
            const words = this.value.trim().split(' ').reverse();
            const newWords = [];
            let length = 0;

            for(let word in words) {
                if(length + word.length > this.maxLength) break;
                if(!word.length) continue;
                newWords.unshift(word)
            }

            this.value = newWords.join(' ')
        }
    }

    private processAdd() {
        while(this.commandQueue.length) {
            this.value += ' ' + this.commandQueue.shift()
        }
        this.reduceValueIfRequired()
    }

    add(text: string) {
        this.commandQueue.push(text);
        this.processAdd()
    }

    clear() {
        this.commandQueue = [];
        this.value = ""
    }

    get() {
        return this.value
    }
}