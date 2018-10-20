const record = require('node-record-lpcm16'),
    speech = require('@google-cloud/speech');

export class MicRecognizer {

    client: any;
    request: any;

    constructor(encoding = "LINEAR16", sampleRateHertz = 16000, languageCode = "en-US") {
        this.client = new speech.SpeechClient();
        this.request = {
            config: {
                encoding: encoding,
                sampleRateHertz: sampleRateHertz,
                languageCode: languageCode,
            },
            interimResults: true // If you want interim results, set this to true
        }
    }

    onTranscription: (text: string, final: boolean) => void;

    private handleData = (data: any) => {
        if(data.results[0] && data.results[0].alternatives[0] && this.onTranscription) {
            this.onTranscription(data.results[0].alternatives[0].transcript, data.results[0].isFinal)
        }
    };

    start() {
        const recognizeStream = this.client
            .streamingRecognize(this.request)
            .on('error', console.error)
            .on('data', this.handleData);

        record
            .start({
                sampleRateHertz: this.request.config.sampleRateHertz,
                threshold: 0,
                // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
                verbose: false,
                recordProgram: 'rec', // Try also "arecord" or "sox"
                silence: '10.0',
            })
            .on('error', console.error)
            .pipe(recognizeStream)
    }

}