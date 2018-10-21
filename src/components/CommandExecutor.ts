import {CommandResult} from "./CommandProcessor";
import {buildDateText} from "../utils";
const request = require('request-promise-native');
const moment = require('moment')

export type CommandResponse = {
    command: CommandResult,
    kind: 'beep'|'speech',
    value: string
}

export class CommandExecutor {

    constructor() {

    }

    callSession: any;

    private executors: { [key: string]: (command: CommandResult) => Promise<CommandResponse> } = {

        "currency_exchange": async command => {
            const to = command.parameters['currency-name'];

            const response = await request({
                uri: 'http://data.fixer.io/api/convert',
                qs: {
                    access_key: "0cd2f839625accff168ebd8c63a1110f",
                    from: command.parameters['unit-currency']['currency'],
                    to,
                    amount: command.parameters['unit-currency']['amount']
                },
                json: true
            });

            if(response.success) {
                return { command, kind: 'speech', value: `It is ${Math.round(response.result)} ${to}` }
            }
            else {
                return { command, kind: 'beep', value: 'failure' }
            }
        },

        "voice_emoji": async command => {
            return { command, kind: 'beep', value: command.parameters['emoji'].replace(/\s/g, '') }
        },

        "create_note": async command => {
            const Evernote = require('evernote')
            const token = 'S=s1:U=94f6c:E=16de9f6b7a7:C=16692458ab8:P=1cd:A=en-devtoken:V=2:H=c45ffed4452170daab76887806c88c84'
            const url = 'https://sandbox.evernote.com/shard/s1/notestore'

            const client = new Evernote.Client({ token })
            const noteStore = client.getNoteStore()

            const content = `<?xml version="1.0" encoding="UTF-8"?>
                <!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
                <en-note>${command.context}</en-note>`

            const note = new Evernote.Types.Note()
            note.title = `Beanie recording ${moment(Date.now()).format()}`
            note.content = content

            try {
                console.log('CREATE_NOTE')
                await noteStore.createNote(note)
                return { command, kind: 'beep', value: 'success' }
            }
            catch(e) {
                console.log(e)
                return { command, kind: 'beep', value: 'failure' }
            }
        },

        "check_calendar": async command => {
            const date = buildDateText(command);

            if(Math.random() > 0.5) {
                return {command, kind: 'speech', value: `You are free ${date}`}
            }
            else {
                return {command, kind: 'speech', value: `You have a secret date with your second girlfriend ${date}`}
            }
        },

        "add_to_calendar": async command => {
            const date = buildDateText(command);
            const location = command.parameters["location"]
                ? (`at ${command.parameters["location"]["business-name"] || command.parameters["location"]["shortcut"]}`)
                : '';

            return {command, kind: 'speech', value: `Created event ${location} ${date}`}
        },

        "end_call": async command => {
            if(!this.callSession) return { command, kind: 'beep', value: 'failure' };
            await request.post({
                uri: 'https://mn.developer.nokia.com/callback/endCallCalled',
                body: this.callSession,
                json: true
            });
            await request.post({
                uri: 'https://mn.developer.nokia.com/callback/endCallCalling',
                body: this.callSession,
                json: true
            });
            return { command, kind: 'beep', value: 'success' }
        },

        "my_geolocation": async command => {
            //NOKIA API is broken so we fake it...
            /*const resp = await request.post({
                uri: 'https://mn.developer.nokia.com/tasseeAPI/location/v1/?address=sip%3A%2B358480786502%40ims8.wirelessfuture.com',
                body: this.callSession,
                headers: {
                    Authorization: '5a8b14c1a353b4000197972f1ae9ba342dc041cf8bdde9a3216e17f0'
                },
                json: true
            });*/

            //TODO: Get name of place from Geolocation.

            return { command, kind: 'speech', value: 'You are at the Junction X Budapest event.'}
        },

        "get_weather": async command => {
            try {
                const apiKey = 'w5wqCJ1JIbh3zbwD51yBy1qc9ZBeReMI'
                const city = command.parameters['geo-city'] || 'Budapest'
                const date = command.parameters['date']
                const cityRes = await request.get({
                    uri: `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`,
                    json: true
                })
                const cityId = cityRes[0].Key
                if (date) {
                    const weatherRes = await request.get({
                        uri: `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityId}?apikey=${apiKey}`,
                        json: true
                    })
                    const weatherText = weatherRes.DailyForecasts[0].Day.IconPhrase
                    return { command, kind: 'speech', value: `The weather tomorrow in ${city} will be ${weatherText}` }
                }
                else {
                    const weatherRes = await request.get({
                        uri: `http://dataservice.accuweather.com/currentconditions/v1/${cityId}?apikey=${apiKey}`,
                        json: true
                    })
                    const weatherText = weatherRes[0].WeatherText
                    return { command, kind: 'speech', value: `The current weather in ${city} is ${weatherText}` }
                }
            }
            catch(e) {

            }
        },

        "how_are_you": async command => ({ command, kind: 'speech', value: 'I am fine. Thank you. How can I help you?' }),

        "stop_listening": async command => ({ command, kind: 'speech', value: 'Okay. Goodbye.' }),

        "keyword": async command => ({ command, kind: 'beep', value: 'keyword' }),
        "success": async command => ({ command, kind: 'beep', value: 'success' })
    };

    async executeCommand(command: CommandResult): Promise<CommandResponse> {
        const executor = this.executors[command.intent];
        if(executor) return executor(command);
        return { command, kind: 'beep', value: 'failure' }
    }

}