import { SpeechContext, CommandProcessor } from './components';
import { hasKeyword, splitByKeyword } from './utils'

export interface Recogniser {
    start: () => void
    onTranscription: (text: string, final: boolean) => any
}

export class IntegratedAssistant {

    recognizer: Recogniser;

    constructor(recognizer: Recogniser, callback: (result: any) => void = null, KEYWORD = "nokia") {
        this.recognizer = recognizer;
        const context = new SpeechContext;
        const command = new SpeechContext;
        const processor = new CommandProcessor;

        let keywordMode = false;
        recognizer.onTranscription = async (text, final) => {
            console.log(`[${final}] ${text}`);

            if (keywordMode) {
                if (final) {
                    const result = splitByKeyword(KEYWORD, text);
                    if (result.context.length) context.add(result.context);
                    if (result.command.length) command.add(result.command);

                    const output = await processor.tryProcess(command.get(), context.get());

                    if (output) {
                        keywordMode = false;
                        context.clear();
                        command.clear();

                        if(callback) callback(output)
                    }
                }
            }
            else if (hasKeyword(KEYWORD, text)) {
                keywordMode = true;
            }
            else if (final) {
                context.add(text)
            }
        }
    }

    start() {
        this.recognizer.start()
    }
}