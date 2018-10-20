import { MicRecognizer } from './src/components/MicRecognizer';

const recognizer = new MicRecognizer();

recognizer.onTranscription = (text, final) => {
    console.log(`[${final ? '🏁' : '🚧'}] ${text}`)
};

recognizer.start();
console.log('Listening, press Ctrl+C to stop.');
