import { BombFX } from '../BombFX.js';
import { Logger } from '../Logger.js';
import { secrets } from '../../data/secrets/secrets.js';
import { streamEventList } from '../../data/streamEventList.js';
import { transitionsList } from '../../data/transitionsList.js';
import { Util } from '../Util.js';
import type { SceneTransition, TransitionScenes } from '../../types/AppTypes.js';
import type { CurrentProgramSceneChangedEvent, GetInputSettingsResponse, InputMuteStateChangedEvent, StreamStateChangedEvent } from '../../types/OBSSocketV5Types.js';

declare var app: BombFX;
declare const OBSWebSocket: any;

export class OBSSocket {

    public socket: any;
    public previousScene: string;
    public currentScene: string;
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
        try {
            const {
                obsWebSocketVersion,
                negotiatedRpcVersion
            } = await this.socket.connect(secrets.obsSocketV5.address, secrets.obsSocketV5.password, {
                rpcVersion: 1
            });
            Logger.obs(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`);
        } catch (error: any) {
            Logger.obs("Failed to connect to OBS");
        }
        //await this.socket.connect(secrets.obsSocketV5.address, secrets.obsSocketV5.password);
    }

    // New version uses new method header, so should match to update for clarity
    public async call(requestType: string, requestData: object = {}): Promise<any> {
        return await this.socket.call(requestType, requestData);
    }

    // SCENES

    // v5 uses ID numbers for most source requests as opposed to the name
    public async getSceneItemId(sourceName: string, sceneName: string): Promise<number> {
        const {sceneItemId} = await this.call('GetSceneItemId', {
            sceneName : sceneName,
            sourceName : sourceName,
            searchOffset : 0
        });
        return sceneItemId;
    }

    public async getSceneItemIdThenCall(sourceName: string, sceneName: string, requestType: string, requestData: object): Promise<void> {
        const sceneItemId: number = await this.getSceneItemId(sourceName, sceneName);
        (<any>requestData).sceneItemId = sceneItemId;
        (<any>requestData).sceneName = sceneName;
        await this.call(requestType, requestData);
    }

    public async getSceneItemList(sceneName: string): Promise<any> {
        const sceneItemList = await this.call('GetSceneItemList', { "sceneName": sceneName });
        return sceneItemList;
    }

    public async getCurrentSceneName(): Promise<string> {
        const {currentProgramSceneName} = await this.socket.call("GetCurrentProgramScene");
        return currentProgramSceneName;
    }

    public async setScene(sceneName: string): Promise<void> {
        await this.socket.call("SetCurrentProgramScene", {
            "sceneName" : sceneName
        });
    }

    // INPUTS (SOURCES)

    public async getInputSettings(inputName: string): Promise<GetInputSettingsResponse> {
        const response: GetInputSettingsResponse = await this.call("GetInputSettings", {
            "inputName" : inputName
        });
        return response;
    }

    public async setInputSettings(inputName: string, inputSettings: object, overlay: boolean = true): Promise<void> {
        await this.call("SetInputSettings", {
            "inputName" : inputName,
            "inputSettings" : inputSettings,
            "overlay" : overlay
        });
    }

    public async showSource(sourceName: string, sceneName: string): Promise<void> {
        await this.hideSource(sourceName, sceneName); // Ensure media is off for restart
        await Util.sleep(200);
        await this.setSceneItemEnabled(sourceName, sceneName, true);
    }

    public async hideSource(sourceName: string, sceneName: string): Promise<void> {
        await this.setSceneItemEnabled(sourceName, sceneName, false);
    }

    public async setSceneItemEnabled(sourceName: string, sceneName: string, enabled: boolean): Promise<void> {
        await this.getSceneItemIdThenCall(sourceName, sceneName, 'SetSceneItemEnabled', {
            "sceneItemEnabled" : enabled
        });
    }

    public async showSourceForDuration(sourceName: string, sceneName: string, durationInMS: number): Promise<void> {
        await this.showSource(sourceName, sceneName);
        await Util.sleep(durationInMS);
        await this.hideSource(sourceName, sceneName);
    }

    public async setText(inputName: string, newText: string): Promise<void> {
        await this.setInputSettings(inputName, { "text": newText } );
    }

    public async clearText(inputName: string): Promise<void> {
        await this.setText(inputName, "");
    }

    public async setBrowserURL(inputName: string, urlIn: string): Promise<void> {
        await this.setInputSettings(inputName, { "url" : urlIn });
    }

    public async changeMirrorSource(inputName: string, newInputToMirror: string): Promise<void> {
        await this.setInputSettings(inputName, { "Source.Mirror.Source" : newInputToMirror });
    }

    // MEDIA INPUTS

    public async playMedia(inputName: string) {
        await this.call('TriggerMediaInputAction', {
            "inputName": inputName,
            "mediaAction": OBSSocket.ObsMediaInputAction.Play
        })
    }

    public async pauseMedia(inputName: string) {
        await this.call('TriggerMediaInputAction', {
            "inputName": inputName,
            "mediaAction": OBSSocket.ObsMediaInputAction.Pause
        })
    }

    public async restartMedia(inputName: string) {
        await this.call('TriggerMediaInputAction', {
            "inputName": inputName,
            "mediaAction": OBSSocket.ObsMediaInputAction.Restart
        })
    }

    // FILTERS

    public async showFilter(sourceName: string, filterName: string): Promise<void> {
        await this.setSourceFilterEnabled(sourceName, filterName, true);
    }

    public async hideFilter(sourceName: string, filterName: string): Promise<void> {
        await this.setSourceFilterEnabled(sourceName, filterName, false);
    }

    public async setSourceFilterEnabled(sourceName: string, filterName: string, filterEnabled: boolean): Promise<void> {
        await this.call('SetSourceFilterEnabled', {
            "sourceName" : sourceName,
            "filterName" : filterName,
            "filterEnabled" : filterEnabled
        });
    }

    public async setSourceFilterSettings(sourceName: string, filterName: string, filterSettings: object, overlay: boolean = true): Promise<void> {
        await this.call('SetSourceFilterSettings', {
            "sourceName": sourceName,
            "filterName": filterName,
            "overlay": overlay,
            "filterSettings": filterSettings
        });
    }

    public async getSourceFilters(sourceName: string): Promise<void> {
        const filters: object = await this.call('GetSourceFilterList', { "sourceName" : sourceName });
        console.log(filters);
    }

    public async getSourceFilterInfo(sourceName: string, filterName: string): Promise<void> {
        const filterInfo: object = await this.call('GetSourceFilter', {
            "sourceName" : sourceName,
            "filterName" : filterName
        });
        console.log(filterInfo);
    }

    // MICROPHONE + AUDIO

    // FIX VOICEMOD STUFF LATER!
    public async muteMic(voicemodSwap: boolean = false): Promise<void> {
        if (voicemodSwap === true) { this.setInputMute("Mic/Aux 2", false); }
        this.setInputMute("Mic/Aux", true);
    };

    public async unmuteMic(voicemodSwap: boolean = false): Promise<void> {
        if (voicemodSwap === true) { this.setInputMute("Mic/Aux 2", true); }
        this.setInputMute("Mic/Aux", false);
    };

    public async muteDesktop(): Promise<void> {
        this.setInputMute("Desktop Audio", true);
    }

    public async unmuteDesktop(): Promise<void> {
        this.setInputMute("Desktop Audio", false);
    }

    public async setInputMute(inputName: string, inputMuted: boolean): Promise<void> {
        this.call('SetInputMute', { "inputName": inputName, "inputMuted": inputMuted });
    }

    public async getInputMute(inputName: string): Promise<boolean> {
        return await this.call('GetInputMute', { "inputName": inputName });
    }

    // UTILITY

    public async getSourceScreenshot(sourceName: string, imageFilePath: string, imageFormat: string = "png"): Promise<string> {
        const {imageData}: any = await this.call('GetSourceScreenshot', {
            "sourceName" : sourceName,
            "imageFormat" : imageFormat,
            "imageFilePath" : imageFilePath
        });
        return <string>imageData;
    }

    public async pressInputPropertiesButton(inputName: string, propertyName: string): Promise<void> {
        await this.call('PressInputPropertiesButton', {
            "inputName" : inputName,
            "propertyName" : propertyName
        });
    }

    public async refreshBrowserSource(inputName: string): Promise<void> {
        await this.pressInputPropertiesButton(inputName, "refreshnocache");
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

        // (OpCode 0) First message sent from the server immediately on client connection.
        this.socket.on('Hello', (data: object) => {
            //Logger.obs("Hello");
            //console.log(data);
        });

        // (OpCode 2) Identify request was received and validated, and the connection is now ready for normal operation.
        this.socket.on('Identified', (data: object) => {
            //Logger.obs("Connection ready");
            //console.log(data);
        });

        this.socket.on('error', (error: object) => {
            Logger.obs("Unhandled Error");
            console.log(error);
        });

        this.socket.on("StreamStateChanged", (data: StreamStateChangedEvent) => {
            if (data.outputActive === true) {
                Logger.bomb("STREAM STARTED!!");
                streamEventList.start();
            } else if (data.outputActive === false) {
                Logger.bomb("STREAM STOPPED!!");
                streamEventList.stop();
            }
        });
    }

    private setSourceEventHandlers() {
        this.socket.on('InputMuteStateChanged', async (eventData: InputMuteStateChangedEvent) => {
            if (eventData.inputName === "Mic/Aux") {
                let voicemodMuted = await this.getInputMute("Mic/Aux 2");
                if (eventData.inputMuted === true && voicemodMuted === true) {
                    this.showSource("Mute Icon", "** Webcam");
                    Logger.noise("MIC MUTED!");
                } else if (eventData.inputMuted === false) {
                    this.hideSource("Mute Icon", "** Webcam");
                    Logger.noise("MIC UNMUTED!");
                }
            }
        });

        this.socket.on('CurrentProgramSceneChanged', async(eventData: CurrentProgramSceneChangedEvent) => {
            // this.currentScene = eventData.sceneName;
        });

        this.socket.on('SceneTransitionStarted', async () => {
            this.previousScene = this.currentScene;
            this.currentScene = await app.obs.getCurrentSceneName();
            const transitionScenes: TransitionScenes = { "fromScene": this.previousScene, "toScene": this.currentScene };

            if (this.transitions.has(this.currentScene)) {
                let transition = this.transitions.get(this.currentScene);
                transition.to(transitionScenes);
            }
            
            if (this.transitions.has(this.previousScene)) {
                let transition = this.transitions.get(this.previousScene);
                transition.from(transitionScenes);
            }
        });
    }
}

export namespace OBSSocket
{
    export enum ObsMediaInputAction {
        None = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_NONE",
        Play = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PLAY",
        Pause = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PAUSE",
        Stop = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_STOP",
        Restart = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_RESTART",
        Next = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_NEXT",
        Previous = "OBS_WEBSOCKET_MEDIA_INPUT_ACTION_PREVIOUS"
    }
}