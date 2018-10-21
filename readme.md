# JUNCTIONxBP NOKIA Integrated Assistant

## Preparation

1) Setup Google Cloud SDK

2) Setup Google Default Credentials, eg.

```bash
 $ export GOOGLE_APPLICATION_CREDENTIALS="/Users/ajuhos/Desktop/JUNCTION/credentials.json"
```

3) [Install SoX](https://www.npmjs.com/package/node-record-lpcm16#dependencies)

## Usage

Start, then talk...

```bash
 $ yarn
 $ tsc
 $ yarn start
```


### What can I say?

You can ask **Beanie** to...

* take a note for your
* create an event in your calendar
* help with the weather
* find you
* convert currencies

You can disable the assistant for a call by saying `beanie stop listening`.

Plus you can use **Voicemoji**, say something like `clap clap` to try it... ;)

## NOKIA Integration

We are currently integrating with NOKIA when:

* asking for your location: we use the cellular tower's location, so no GPS or internet is needed. (it not works in the sandbox)
* playing you pre-call announcements, like birthday reminders.
* managing the call by voice (eg. `beanie end call`)

In the future the whole audio will be managed via the NOKIA network for features like
in-call access to assistant and private responses.

## Dev Tips

#### ffmpeg command for announcements

```
-i {INPUTFILE} -acodec pcm_alaw -ar 8000 -ac 1 {OUTPUTFILE}`
```