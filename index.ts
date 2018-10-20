import { MicRecognizer, SpeechContext, CommandProcessor } from './src/components';
import { hasKeyword, splitByKeyword } from './src/utils'

const KEYWORD = "nokia";

const recognizer = new MicRecognizer;
const context = new SpeechContext;
const command = new SpeechContext;
const processor = new CommandProcessor;

let keywordMode = false;
recognizer.onTranscription = (text, final) => {
    console.log(`[${final}] ${text}`);

    if(keywordMode) {
        if(final) {
            const result = splitByKeyword(KEYWORD, text);
            if(result.context.length) context.add(result.context);
            if(result.command.length) command.add(result.command);

            if(processor.tryProcess(command.get(), context.get())) {
                keywordMode = false;
                context.clear();
                command.clear()
            }
        }
    }
    else if(hasKeyword(KEYWORD, text)) {
        keywordMode = true;
    }
    else if(final) {
        context.add(text)
    }
};

recognizer.start();
console.log('Listening, press Ctrl+C to stop.');
