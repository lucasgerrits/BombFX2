# Bomb FX 2

This is 95% of the code that runs my (CareFreeBomb's) stream. It is run as a browser source inside of OBS Studio (Open Broadcaster Software) with the remote debug console docked. The source is posted here publically not to be run locally, but for the purpose of example for any curious parties - whether they be Twitch viewers or potential employers looking to see how I waste my free time.

## Prerequisites

The following packages will be needed to be included in the /vendor directory:

* [ComfyJS](https://github.com/instafluff/ComfyJS) - Comfiest Twitch Chat Library for JavaScript | NodeJS + Browser Support
This simplifies chat (via TMI.js), bits, subs, and channel point reward events from Twitch. The creator also streams!

* [Azure cognitive-services-speech-sdk-js](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/quickstarts/setup-platform?pivots=programming-language-javascript) - provides speech-to-text capabilities with an Azure Speech resource.

* [aws-sdk-js-3](https://github.com/aws/aws-sdk-js-v3) - Modularized AWS SDK for JavaScript.
Used for Amazon Polly text-to-speech services.

* [obs-websocket-js v5](https://github.com/obs-websocket-community-projects/obs-websocket-js) - allows Javascript-based connections to the Open Broadcaster Software plugin obs-websocket.
Needed for most websocket calls to manipulate scenes, sources, and filters in OBS.

## Interfaces With

* [Streamer.bot](https://www.streamer.bot/) - for Windows Speech Recognition and VoiceMod.
* [Heat](https://heat.j38.net/) - a Twitch Extension that allows for user engagement through clicking directly on the video.

## Built With

* [TypeScript](https://www.typescriptlang.org/)
* [Visual Studio Code](https://visualstudio.microsoft.com/)
* [OBS Studio](https://obsproject.com/)
* Red Bull
* Hate

## FAQ

Q: Why isn't this a Node app
A: Spaghetti

Q: Why don't you just use Streamer.bot / SAMMI / MixItUp / Biku
A: Spaghetti

## Obligatory Shill

* [Twitch](https://www.twitch.tv/carefreebomb) - to see it in action
* [Discord](https://discord.gg/0X84YV4Sn1v0wyUa) - for any questions related to this mess
* [Twitter](https://twitter.com/carefreeb0mb) - you can also find me on bird
