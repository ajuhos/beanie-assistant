import { IntegratedAssistant } from './src/IntegratedAssistant';
import { MicRecognizer } from './src/components';

const assistant = new IntegratedAssistant(new MicRecognizer, result => {
    console.log(result)
});

assistant.start();
console.log('Listening, press Ctrl+C to stop.');