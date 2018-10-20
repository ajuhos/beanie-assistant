import {SpeechContext, CommandProcessor, CommandResult} from './components';
import { hasKeyword, splitByKeyword, extractVoiceEmoji } from './utils'

const DEFAULT_EMOJI_LIST = [ 'clap clap', 'beep beep' ];
const MAX_TRIALS = 0;

export interface Recogniser {
    start: () => void
    onTranscription: (text: string, final: boolean) => any
}

export class IntegratedAssistant {

    recognizer: Recogniser;
    private enabled: boolean = true;

    constructor(recognizer: Recogniser, callback: (result: CommandResult) => Promise<void> = null, KEYWORD = "beanie", EMOJI_LIST = DEFAULT_EMOJI_LIST) {
        this.recognizer = recognizer;
        const context = new SpeechContext;
        const command = new SpeechContext;
        const processor = new CommandProcessor;

        let keywordMode = false;
        let trials = 0;
        recognizer.onTranscription = async (text, final) => {
            if(!this.enabled) {
                console.log("SKIP");
                return;
            }

            console.log(`[${final}][${keywordMode}] ${text}`);

            if (keywordMode) {
                if (final) {
                    const result = splitByKeyword(KEYWORD, text);
                    if (result.context.length) context.add(result.context);
                    if (result.command.length) command.add(result.command);

                    console.log('command', command.get());

                    if(command.get().length) {
                        console.log('processing command...');
                        const output = await processor.tryProcess(command.get(), context.get());

                        if (output) {
                            this.enabled = false;
                            keywordMode = false;
                            context.clear();
                            command.clear();

                            if (callback) await callback(output);
                            this.enabled = true;
                        }
                        else if (trials < MAX_TRIALS) {
                            trials++
                        }
                        else {
                            keywordMode = false;
                            context.clear();
                            command.clear();

                            if (callback) callback({intent: "failure", context: "", command: "", parameters: {}})
                        }
                    }
                }
            }
            else if (hasKeyword(KEYWORD, text)) {
                keywordMode = true;
                if(callback) callback({ intent: "keyword", context: "", command: "", parameters: {} })
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