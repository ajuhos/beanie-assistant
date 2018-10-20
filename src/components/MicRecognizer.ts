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
            interimResults: true
        }
    }

    onTranscription: (text: string, final: boolean) => void;

    private handleData = (data: any) => {
        if(data.results[0] && data.results[0].alternatives[0] && this.onTranscription) {
            this.onTranscription(data.results[0].alternatives[0].transcript, data.results[0].isFinal)
        }
    };

    start() {
        console.log("The assistant is starting up...");

        const recognizeStream = this.client
            .streamingRecognize(this.request)
            .on('error', () => {
                this.start()
            })
            .on('data', (data) => {
                this.handleData(data)
            });

        record
            .start({
                sampleRateHertz: this.request.config.sampleRateHertz,
                threshold: 0,
                verbose: false,
                recordProgram: 'rec',
                silence: '10.0',
            })
            .on('error', console.error)
            .pipe(recognizeStream)
    }

}