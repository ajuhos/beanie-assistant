import { IntegratedAssistant } from './src/IntegratedAssistant';
import { MicRecognizer } from './src/components';

const assistant = new IntegratedAssistant(new MicRecognizer);
assistant.start();
console.log('Listening, press Ctrl+C to stop.');