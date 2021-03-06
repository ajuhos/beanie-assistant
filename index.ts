import { IntegratedAssistant } from './src/IntegratedAssistant';
import {MicRecognizer, CommandExecutor, ResponseExecutor} from './src/components';
import {NokiaTAS} from "./src/NokiaTAS";

const server = new NokiaTAS;
server.listen();

const executor = new CommandExecutor;
const responder = new ResponseExecutor;
const assistant = new IntegratedAssistant(new MicRecognizer, async command => {
    executor.callSession = server.callSession;
    const result = await executor.executeCommand(command);
    if(result) {
        await responder.executeResponse(result);
        console.log(result)
    }
});

assistant.start();
console.log('Listening, press Ctrl+C to stop.');