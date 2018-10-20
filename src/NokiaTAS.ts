import {ResponseExecutor} from "./components";

const bodyParser = require('body-parser'),
    express = require('express');

export class NokiaTAS {

    callSession: any;

    private app: any;
    private responder = new ResponseExecutor;

    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());

        this.app.use('/sounds', express.static('sounds'));

        this.app.post('/', async (req, res) => {
            const session = this.callSession = req.body;

          /*  await this.responder.executeResponse({
                kind: 'speech',
                value: 'The person you are calling has birthday this week. I am starting the call now.',
                command: null
            });

            res.send({
                "action": {
                    "actionToPerform": "Continue",
                    "displayAddress": session.callEventNotification.callingParticipant
                }
            });*/

            console.log("Playing birthday reminder...");

            res.send({
                "action": {
                    "actionToPerform": "Continue",
                    "displayAddress": session.callEventNotification.calledParticipant,
                    "digitCapture": {
                        "playingConfiguration": {
                            "playFileLocation": "https://f0bc3ace.ngrok.io/sounds/birthday_long.wav"
                        },
                        "callParticipant": [
                            session.callEventNotification.callingParticipant
                        ]
                    }
                }
            })
        })

    }

    listen() {
        this.app.listen(3333)
    }

}