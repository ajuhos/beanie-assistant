import {CommandResult} from "./CommandProcessor";
const request = require('request-promise-native');
const moment = require('moment');

export type CommandResponse = {
    command: CommandResult,
    kind: 'beep'|'speech',
    value: string
}

export class CommandExecutor {

    constructor() {

    }

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
            const date = moment(
                command.parameters["date-time"].date_time ||
                command.parameters["date-time"].startDateTime ||
                command.parameters["date"]
            ).calendar();

            if(Math.random() > 0.5) {
                return {command, kind: 'speech', value: `You are free on ${date}`}
            }
            else {
                return {command, kind: 'speech', value: `You have a secret date with your second girlfriend on ${date}`}
            }
        },

        "success": async command => ({ command, kind: 'beep', value: 'success' })
    };

    async executeCommand(command: CommandResult): Promise<CommandResponse> {
        const executor = this.executors[command.intent];
        if(executor) return executor(command);
        return { command, kind: 'beep', value: 'failure' }
    }

}