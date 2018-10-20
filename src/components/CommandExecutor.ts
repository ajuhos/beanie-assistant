import {CommandResult} from "./CommandProcessor";
const request = require('request-promise-native');

export type CommandResponse = {
    command: CommandResult,
    kind: 'beep'|'speech',
    value: string
}

export class CommandExecutor {

    constructor() {

    }

    private executors: { [key: string]: (command: CommandResult) => Promise<CommandResponse> } = {

        "currency_exchange": async (command) => {
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

            console.log(response);

            if(response.success) {
                return {command, kind: 'speech', value: `It is ${Math.round(response.result)} ${to}`}
            }
            else {
                return {command, kind: 'beep', value: 'failure' }
            }
        }

    };

    async executeCommand(command: CommandResult) {
        const executor = this.executors[command.intent];
        if(executor) return executor(command);
        return false
    }

}