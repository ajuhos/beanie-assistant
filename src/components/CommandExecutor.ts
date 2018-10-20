import {CommandResult} from "./CommandProcessor";
import {buildDateText} from "../utils";
const request = require('request-promise-native');

export type CommandResponse = {
    command: CommandResult,
    kind: 'beep'|'speech',
    value: string
}

export class CommandExecutor {

    constructor() {

    }

    callSession: any;

    private executors: { [key: string]: (command: CommandResult) => Promise<CommandResponse> } = {

        "currency_exchange": async command => {
            const to = command.parameters['currency-name'];

            const response = await request({
                uri: 'http://data.fixer.io/api/convert',
                qs: {
                    access_key: "0cd2f839625accff168ebd8c63a1110f",
                    from: command.parameters['unit-currency']['currency'],
                    to,
                    amount: command.parameters['unit-currency']['amount']
                },
                json: true
            });

            if(response.success) {
                return { command, kind: 'speech', value: `It is ${Math.round(response.result)} ${to}` }
            }
            else {
                return { command, kind: 'beep', value: 'failure' }
            }
        },

        "voice_emoji": async command => {
            return { command, kind: 'beep', value: command.parameters['emoji'].split(' ')[0] }
        },

        "create_note": async command => {
            return { command, kind: 'beep', value: 'success' }
        },

        "check_calendar": async command => {
            const date = buildDateText(command);

            if(Math.random() > 0.5) {
                return {command, kind: 'speech', value: `You are free ${date}`}
            }
            else {
                return {command, kind: 'speech', value: `You have a secret date with your second girlfriend ${date}`}
            }
        },

        "end_call": async command => {
            if(!this.callSession) return { command, kind: 'beep', value: 'failure' };
            await request.post({
                uri: 'https://mn.developer.nokia.com/callback/endCallCalled',
                body: this.callSession,
                json: true
            });
            return { command, kind: 'beep', value: 'success' }
        },

        "keyword": async command => ({ command, kind: 'beep', value: 'keyword' }),
        "success": async command => ({ command, kind: 'beep', value: 'success' })
    };

    async executeCommand(command: CommandResult): Promise<CommandResponse> {
        const executor = this.executors[command.intent];
        if(executor) return executor(command);
        return { command, kind: 'beep', value: 'failure' }
    }

}