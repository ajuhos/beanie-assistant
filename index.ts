import { IntegratedAssistant } from './src/IntegratedAssistant';
import { MicRecognizer, CommandExecutor } from './src/components';

const executor = new CommandExecutor;
const assistant = new IntegratedAssistant(new MicRecognizer, async command => {
    const result = await executor.executeCommand(command);
    console.log(result)
});

assistant.start();
console.log('Listening, press Ctrl+C to stop.');