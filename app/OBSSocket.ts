import { BombFX } from './BombFX.js';
import { Logger } from './Logger.js';
import { secrets } from '../data/secrets.js';
import { streamEventList } from '../data/streamEventList.js';
import { transitionsList } from '../data/transitionsList.js';
import { Util } from './Util.js';
import type { SceneTransition } from '../types/AppTypes.js';
import type { SourceMuteStateChangedEvent, TakeSourceScreenshotResponse, TransitionBeginEvent } from '../types/OBSSocketTypes.js';

declare var app: BombFX;
declare const OBSWebSocket: any;

export class OBSSocket {

    public socket: any;
    private transitions: Map<string, SceneTransition>;

    constructor() {
        this.socket = new OBSWebSocket();
        this.setEventHandlers();
        this.connect();
        this.transitions = new Map<string, SceneTransition>(
            transitionsList.map(t => [t.scene, t])
        );
    }

    private async connect(): Promise<void> {
        await this.socket.connect({ 
            address: secrets.obssocket.address, 
            password: secrets.obssocket.password
        });
    }

    public async send(requestType: string, requestData?: object): Promise<any> {
        await this.socket.send(requestType, requestData);
    }

    // SOURCES

    public async showSource(sourceIn: string, sceneIn: string): Promise<void> {
        await this.hideSource(sourceIn, sceneIn); // Ensure media is off for restart
        await Util.sleep(200);
        await this.socket.send('SetSceneItemRender', {
            "scene-name" : sceneIn,
            "source" : sourceIn,
            "render" : true
        });
    }

    public async hideSource(sourceIn: string, sceneIn: string): Promise<void> {
        this.socket.send('SetSceneItemRender', {
            "scene-name" : sceneIn,
            "source" : sourceIn,
            "render" : false
        });
    }

    public async showSourceForDuration(sourceIn: string, sceneIn: string, duration: number): Promise<void> {
        await this.showSource(sourceIn, sceneIn);
        await Util.sleep(duration);
        await this.hideSource(sourceIn, sceneIn);
    }

    public async setText(sourceName: string, newText: string): Promise<void> {
        this.socket.send('SetTextGDIPlusProperties', {
            "source" : sourceName,
            "text" : newText
        });
    }

    public async clearText(sourceName: string): Promise<void> {
        this.socket.send("SetTextGDIPlusProperties", {
            "source" : sourceName,
            "text" : ""
        });
    }

    public async setBrowserURL(sourceName: string, urlIn: string): Promise<void> {
        this.socket.send('SetSourceSettings', {
            "sourceName" : sourceName,
            "sourceType" : "browser_source",
            "sourceSettings" : {
                "url" : urlIn
            }
        });
    }

    public async changeMirrorSource(mirrorName: string, newSourceName: string): Promise<void> {
        this.socket.send("SetSourceSettings", {
            "sourceName" : mirrorName,
            "sourceSettings" : {
                "Source.Mirror.Source" : newSourceName
            }
        });
    }

    // MEDIA SOURCES

    public async playMedia(sourceName: string) {
        this.socket.send('PlayPauseMedia', {
            "sourceName" : sourceName,
            "playPause" : false // play
        });
    }

    public async pauseMedia(sourceName: string) {
        this.socket.send('PlayPauseMedia', {
            "sourceName" : sourceName,
            "playPause" : true // pause
        });
    }

    public async restartMedia(sourceName: string) {
        this.socket.send('RestartMedia', {
            "sourceName" : sourceName,
        });
    }

    // FILTERS

    public async showFilter(sourceName: string, filterName: string): Promise<void> {
        this.socket.send("SetSourceFilterVisibility", {
            "sourceName" : sourceName,
            "filterName" : filterName,
            "filterEnabled" : true
        });
    }

    public async hideFilter(sourceName: string, filterName: string): Promise<void> {
        this.socket.send("SetSourceFilterVisibility", {
            "sourceName" : sourceName,
            "filterName" : filterName,
            "filterEnabled" : false
        });
    }

    // SCENES

    public async getCurrentSceneName(): Promise<string> {
        let obj = await this.socket.send("GetCurrentScene");
        return obj.name;
    }

    public async setScene(sceneName: string): Promise<void> {
        this.socket.send("SetCurrentScene", {
            "scene-name" : sceneName
        });
    }

    // MICROPHONE + AUDIO

    public async muteMic(voicemodSwap: boolean = false): Promise<void> {
        if (voicemodSwap === true) {
            this.socket.send("SetMute", { "source" : "Mic/Aux 2", "mute" : false });
        }
        this.socket.send("SetMute", { "source" : "Mic/Aux", "mute" : true });
    };
     
    public async unmuteMic(voicemodSwap: boolean = false): Promise<void> {
        if (voicemodSwap === true) {
            this.socket.send("SetMute", { "source" : "Mic/Aux 2", "mute" : true });
        }
        this.socket.send("SetMute", { "source" : "Mic/Aux", "mute" : false });
    };

    public async muteDesktop(): Promise<void> {
        this.socket.send("SetMute", { "source" : "Desktop Audio", "mute" : true });
    }

    public async unmuteDesktop(): Promise<void> {
        this.socket.send("SetMute", { "source" : "Desktop Audio", "mute" : false });
    }

    // UTILITY

    public async screenshot(sourceName: string, filePath: string, embedPictureFormat: string = "png"): Promise<TakeSourceScreenshotResponse> {
        let response: TakeSourceScreenshotResponse = await this.socket.send('TakeSourceScreenshot', {
            "sourceName": sourceName,
            "embedPictureFormat": embedPictureFormat,
            "saveToFilePath": filePath
        });
        return response;
    }

    public async refreshCode(): Promise<void> {
        await this.socket.send('RefreshBrowserSource', {
            "sourceName" : "Bomb FX 2"
        });
    };
     
    public async refreshChat(): Promise<void> {
        await this.socket.send('RefreshBrowserSource', {
            "sourceName" : "Sideways Chat"
        });
    };

    public async ebNames(): Promise<void> {
        this.clearText("EarthBound Name #1");
        this.clearText("EarthBound Name #2");
        this.clearText("EarthBound Name #3");
        this.clearText("EarthBound Name #4");
    };

    // DEBUG
 
    public async getSourceFilters(sourceName: string): Promise<void> {
        let filters: object = await this.socket.send('GetSourceFilters', {
            "sourceName" : sourceName
        });
        console.log(filters);
    }

    public async getSourceFilterInfo(sourceName: string, filterName: string): Promise<void> {
        let filterInfo: object = await this.socket.send('GetSourceFilterInfo', {
            "sourceName" : sourceName,
            "filterName" : filterName
        });
        console.log(filterInfo);
    }

    public async getSceneList(sceneName: string): Promise<void> {
        let sceneList: object = await this.socket.send("GetSceneItemList", {
            "sceneName" : sceneName
        });
        console.log(sceneList);
    }

    public async getSourceSettings(sourceName: string): Promise<void> {
        let sourceSettings: object = await this.socket.send("GetSourceSettings", {
            "sourceName" : sourceName
        });
        console.log(sourceSettings);
    }
    
    // EVENT HANDLERS

    private setEventHandlers(): void {
        this.setConnectionEventHandlers();
        this.setSourceEventHandlers();
    }

    private setConnectionEventHandlers(): void {
        this.socket.on('ConnectionOpened', () => {
            Logger.obs("Connection Opened");
        });

        this.socket.on('ConnectionClosed', () => {
            Logger.obs("Connection Closed");
        });

        this.socket.on('AuthenticationSuccess', () => {
            Logger.obs("Authentication Success");
        });

        this.socket.on('AuthenticationFailure', (data: object) => {
            Logger.obs("Authentication Failure");
            console.log(data);
        });

        this.socket.on('error', (error: object) => {
            Logger.obs("Unhandled Error");
            console.log(error);
        });

        this.socket.on("StreamStarted", () => {
            Logger.bomb("STREAM STARTED!!");
            streamEventList.start();
        });

        this.socket.on("StreamStopped", () => {
            Logger.bomb("STREAM STOPPED!!");
            streamEventList.stop();
        });
    }

    private setSourceEventHandlers() {
        this.socket.on('MediaRestarted', function(data: object) {
            //Util.log("OBS Media Restarted: \'" + data.sourceName + "\'");
            //console.log(data);
        });
        
        this.socket.on('SourceMuteStateChanged', async (data: SourceMuteStateChangedEvent) => {
            if (data.sourceName === "Mic/Aux") {
                let voicemod = await this.socket.send('GetMute', { "source" : "Mic/Aux 2" });
                if (data.muted === true && voicemod.muted === true) {
                    this.showSource("Mute Icon", "** Webcam");
                    Logger.noise("MIC MUTED!");
                } else if (data.muted === false) {
                    this.hideSource("Mute Icon", "** Webcam");
                    Logger.noise("MIC UNMUTED!");
                }
            }
        });

        this.socket.on('TransitionBegin', async (data: TransitionBeginEvent) => {
            if (this.transitions.has(data.toScene)) {
                let transition = this.transitions.get(data.toScene);
                transition.to(data);
            }

            if (this.transitions.has(data.fromScene)) {
                let transition = this.transitions.get(data.fromScene);
                transition.from(data);
            }
        });
    }
}