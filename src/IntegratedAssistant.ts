import {SpeechContext, CommandProcessor, CommandResult} from './components';
import { hasKeyword, splitByKeyword, extractVoiceEmoji } from './utils'

const DEFAULT_EMOJI_LIST = [ 'clap clap', 'beep beep' ];

export interface Recogniser {
    start: () => void
    onTranscription: (text: string, final: boolean) => any
}

export class IntegratedAssistant {

    recognizer: Recogniser;
    enabled: boolean = true;

    constructor(recognizer: Recogniser, callback: (result: CommandResult) => void = null, KEYWORD = "nokia", EMOJI_LIST = DEFAULT_EMOJI_LIST) {
        this.recognizer = recognizer;
        const context = new SpeechContext;
        const command = new SpeechContext;
        const processor = new CommandProcessor;

        let keywordMode = false;
        recognizer.onTranscription = async (text, final) => {
            if(!this.enabled) return;

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
                const emoji = extractVoiceEmoji(EMOJI_LIST, text);
                if(emoji) {
                    callback({ intent: 'voice_emoji', command: '', context: '', parameters: { emoji } })
                }
                else {
                    context.add(text)
                }
            }
        }
    }

    start() {
        this.recognizer.start()
    }
}