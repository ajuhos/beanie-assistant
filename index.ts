import { IntegratedAssistant } from './src/IntegratedAssistant';
import {MicRecognizer, CommandExecutor, ResponseExecutor} from './src/components';

const executor = new CommandExecutor;
const responder = new ResponseExecutor;
const assistant = new IntegratedAssistant(new MicRecognizer, async command => {
    const result = await executor.executeCommand(command);
    if(result) {
        assistant.enabled = false;
        await responder.executeResponse(result);
        assistant.enabled = true;

        console.log(result)
    }
});

assistant.start();
console.log('Listening, press Ctrl+C to stop.');