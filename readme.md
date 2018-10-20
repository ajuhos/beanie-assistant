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
 $ yarn start
```

## Tips

-i {INPUTFILE} -acodec pcm_alaw -ar 8000 -ac 1 {OUTPUTFILE}