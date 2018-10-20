export class CommandProcessor {

    tryProcess(command: string, context: string) {
        const words = command.trim().split(' ');
        if(words.length > 2) {
            console.log({ context, command });
            return true
        }

        return false
    }

}