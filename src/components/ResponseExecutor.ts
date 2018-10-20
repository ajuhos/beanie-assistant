import {CommandResponse} from "./CommandExecutor";
const textToSpeech = require('@google-cloud/text-to-speech');
const player = require('play-sound')({});
const fs = require('fs');

export class ResponseExecutor {

    client: any;

    constructor() {
        this.client = new textToSpeech.TextToSpeechClient();
    }

    private async sayResponse(value: string) {
        return new Promise((resolve, reject) => {
            const request = {
                input: {text: value},
                voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
                audioConfig: {audioEncoding: 'MP3'}
            };

            this.client.synthesizeSpeech(request, (err, response) => {
                if (err) return reject(err);

                fs.writeFile('./output.mp3', response.audioContent, 'binary', err => {
                    if (err) return reject(err);
                    player.play('./output.mp3', () => resolve())
                })
            })
        })
    }

    private async beepResponse(value: string) {
        return new Promise(resolve => player.play(`./sounds/${value}.mp3`, () => resolve()))
    }

    async executeResponse({ kind, value }: CommandResponse) {
        if(kind === 'speech') return this.sayResponse(value);
        else return this.beepResponse(value)
    }

}