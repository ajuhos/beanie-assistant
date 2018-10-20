import { IntegratedAssistant } from './IntegratedAssistant';
import { FileRecognizer } from './components';
const isEqual = require('lodash.isequal')

const tests = [
    {
        name: 'Create note with `Hello. How Are you?`',
        file: './audio.wav',
        expect: {
            intent: 'create_note',
            parameters: {},
            context: 'Hello. what Are You?'
        }
    },
    {
        name: 'Create note with `Hello. How Are you?`',
        file: './audio.wav',
        expect: {
            intent: 'create_note',
            parameters: {},
            context: 'Hello. How Are You?'
        }
    },
]

let numOfPassed = 0

tests.forEach((test, i) => {
    const assistant = new IntegratedAssistant(new FileRecognizer(test.file), (result) => {

        const normalisedExpect = {
            intent: test.expect.intent,
            parameters: test.expect.parameters,
            context: test.expect.context.toLowerCase().trim()
        }
        const normalisedResult = {
            intent: result.intent,
            parameters: result.parameters,
            context: result.context.toLowerCase().trim()
        }
        const passed = isEqual(normalisedExpect, normalisedResult)

        console.log(`${test.name} ${passed ? '✔' : '❌'}`)
        
        if (!passed) {
            console.log(normalisedExpect)
            console.log(normalisedResult)
        }
        else {
            numOfPassed = numOfPassed + 1;
        }

        if (i === tests.length - 1) {
            console.log(`Passed: ${numOfPassed}/${tests.length}`)
        }
    });

    assistant.start();
});