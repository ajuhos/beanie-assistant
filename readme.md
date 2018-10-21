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

## The Magic behind Beanie

What makes Beanie different in a technical sense, is how and when it listens to you.

While other assistants are available on your smart devices - and require internet access
for most capabilities - Beanie lives in the Telephony Network and accessible via a direct
phone call (to the Beanie Number) or inside any call of yours (eg. a call with a friend).
This makes Beanie available when and where on other assistant can help you.

The other important difference is how he listens, while others start listening after hearing
a keyword (like `hey Google`), Beanie is always there. We don't store anything and don't try
to understand what you said before hearing the keyword, but we use your last sentences as
the context. So Beanie works like the real assistant (like Donna from Suits), who hears
everything and always there to help. For example you can ask Beanie to take a note after saying
or hearing the contents of the to-be-created note.

This is done by separating the pre-keyword and the post-keyword part of what you said and
building the input for intents by using both in a reverse order (as intents make more sense
in that order).


## Dev Tips

#### ffmpeg command for announcements

```
-i {INPUTFILE} -acodec pcm_alaw -ar 8000 -ac 1 {OUTPUTFILE}`
```