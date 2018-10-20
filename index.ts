import { IntegratedAssistant } from './src/IntegratedAssistant';
import {MicRecognizer, CommandExecutor, ResponseExecutor} from './src/components';

const executor = new CommandExecutor;
const responder = new ResponseExecutor;
const assistant = new IntegratedAssistant(new MicRecognizer, async command => {
    const result = await executor.executeCommand(command);
    if(result) {
        await responder.executeResponse(result);
        console.log(result)
    }
});

assistant.start();
console.log('Listening, press Ctrl+C to stop.');