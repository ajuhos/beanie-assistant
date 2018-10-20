// Imports the Dialogflow library
const dialogflow = require('dialogflow');

export class CommandProcessor {

    sessionClient: any;
    sessionPath: any;

    constructor() {
        this.sessionClient = new dialogflow.SessionsClient();
        this.sessionPath = this.sessionClient.sessionPath('junction-220007', 'teszt');
    }

    async tryProcess(command: string, context: string) {
        /*    const words = command.trim().split(' ');
        if(words.length > 2) {
              console.log({ context, command });
              return true
          }*/

        console.log({ context, command });

        const [ response ] = await this.sessionClient.detectIntent({
            session: this.sessionPath,
            queryInput: {
                text: {
                    text: command + ' ' + context,
                    languageCode: 'en-US',
                },
            },
        });

        console.log(response);

        return false
    }

}