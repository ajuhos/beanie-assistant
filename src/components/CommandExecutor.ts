import {CommandResult} from "./CommandProcessor";

export type CommandResponse = {
    command: CommandResult,
    kind: 'beep'|'speech',
    value: string
}

export class CommandExecutor {

    constructor() {

    }

    private executors: { [key: string]: (command: CommandResult) => Promise<CommandResponse> } = {

        "currency_exchange": async (command) => ({ command, kind: 'beep', value: 'success' })

    };

    async executeCommand(command: CommandResult) {
        const executor = this.executors[command.intent];
        if(executor) return executor(command);
        return false
    }

}