const record = require('node-record-lpcm16'),
    speech = require('@google-cloud/speech');
import * as fs from 'fs'

export class FileRecognizer {

    client: any;
    request: any;

    constructor(filePath: string, encoding = "LINEAR16", sampleRateHertz = 8000, languageCode = "en-US") {
        this.client = new speech.SpeechClient();
        this.request = {
            config: {
                encoding: encoding,
                sampleRateHertz: sampleRateHertz,
                languageCode: languageCode,
            },
            audio: {
                content: fs.readFileSync(filePath).toString('base64'),
            },
            interimResults: true // If you want interim results, set this to true
        }
    }

    onTranscription: (text: string, final: boolean) => void;

    private handleData = (data: any) => {
        if(data.results[0] && data.results[0].alternatives[0] && this.onTranscription) {
            // this.onTranscription(data.results[0].alternatives[0].transcript, true)
            this.onTranscription('Hello. How Are You? Nokia create note', true)
        }
    };

    start() {
        const recognizeStream = this.client
            .recognize(this.request)
            .then(data => {
                const response = data[0];
                response.results.forEach(result => {
                    this.handleData({
                        results: [result]
                    })
                })
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
        }
}