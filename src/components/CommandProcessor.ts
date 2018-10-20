// Imports the Dialogflow library
const dialogflow = require('dialogflow');
const FALLBACK_INTENT = 'Default Fallback Intent';

export type CommandResult = {
    intent: string,
    parameters: { [key:string]: any },
    context: string,
    command: string
}

export class CommandProcessor {

    sessionClient: any;
    sessionPath: any;

    constructor() {
        this.sessionClient = new dialogflow.SessionsClient();
        this.sessionPath = this.sessionClient.sessionPath('junction-220007', 'teszt');
    }

    private processParameterList(parameters: any) {
        for(let parameterName in parameters) {
            if(parameters.hasOwnProperty(parameterName)) {
                parameters[parameterName] = this.processParameter(parameters[parameterName])
            }
        }
        return parameters
    }

    private processParameter(parameter: { structValue?: { fields: any }, stringValue?: any, kind: string }) {
        console.log(parameter);
        if(parameter.kind === "structValue") {
            return this.processParameterList(parameter.structValue.fields)
        }
        else {
            return parameter[parameter.kind]
        }
    }

    async tryProcess(command: string, context: string): Promise<CommandResult|false> {
        let [ { queryResult: { parameters, intent: { displayName: intent } } } ]
            = await this.sessionClient.detectIntent({
                session: this.sessionPath,
                queryInput: {
                    text: {
                        text: command + ' ' + context,
                        languageCode: 'en-US',
                    },
                },
            });

        if(intent === FALLBACK_INTENT) return false;

        if(parameters) {
            parameters = this.processParameterList(parameters.fields);

        }

        return { intent, parameters, context, command }
    }

}