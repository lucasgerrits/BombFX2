import { BombFX } from "../BombFX.js";
import { Logger } from "../Logger.js";
import { secrets } from "../../data/secrets/secrets.js";
import type { ClickData } from "../../types/HeatTypes";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class Heat extends EventTarget {
    private channelId: number;
    private users: Map<string, unknown>;
    private clicks: number = 1;
    
    private ignoredUsers: Set<string>;

    constructor() {
        super();

        if (!secrets.channelID) {
            Logger.heat("Invalid channel ID.");
            return;
        }

        this.channelId = secrets.channelID;
        this.connect();

        this.users = new Map<string, unknown>();

        this.ignoredUsers = new Set();
        this.setBanned();
    }

    private setBanned(): void {
        this.ignoredUsers.add("IClickDaCFB");
    }

    private connect(): void {
        const url: string = "wss://heat-api.j38.net/channel/" + this.channelId;
        // Logger.heat("Connecting to Heat API server.");
        let ws: WebSocket = new WebSocket(url);

        // Initial connection.
        ws.addEventListener("open", () => {
            Logger.heat("Connected to Heat API server");
        });

        // Message received.
        ws.addEventListener("message", async (message) => {
            //console.log(message);
            const data: any = JSON.parse(message.data);
            const event: CustomEvent = new CustomEvent(data.type, { detail: data });
            this.dispatchEvent(event);

            if (data.type === "system") {
                // Logger.heat("System message: " + data.message);
            }

            if (data.type === "click") {
                const user: any = await this.getUserById(data.id);

                const newX: number = (data.x * 1920);
                const newY: number = (data.y * 1080);
                
                if (user.display_name !== "Unverified" && !this.ignoredUsers.has(user.display_name)) {
                    Logger.heat("User: " + user.display_name + ", X: " + newX + ", Y: " + newY);
                }

                const click: ClickData = {
                    username: user.display_name,
                    userImg: user.img,
                    coords: {
                        x: newX,
                        y: newY
                    }
                };
                this.processClick(click);
            }
        });

        // Error handling.
        ws.addEventListener("error", (event) => {
            Logger.heat("Error:");
            console.log(event);
        });

        // Handle close and reconnect.
        ws.addEventListener("close", (event) => {
            Logger.heat("Connection closed:");
            console.log(event);
            ws = null;
            setTimeout(() => { this.connect(); }, 1000);
        });
    }

    private async processClick(clickData: ClickData): Promise<void> {
        this.clicks++;
        this.uwuClick(clickData);
    }

    private async uwuClick(click: ClickData): Promise<void> {
        // Options determining size and duration of visual click indicator
        const persistence: boolean = false; // default = false
        const size: number = 50; // default = 50
        const displayDuration: number = 1500; // default = 1500, if persistence false, this is display length 

        // Determing position of indicator inside container div based on where stream was clicked
        const left: number = click.coords.x - (size / 2);
        const top: number = click.coords.y - (size / 2);

        // The div where indicators are displayed on stream browser source
        const clickBox: HTMLElement = document.getElementById("click-box");

        // The click indicator HTML element
        const uwuImg: HTMLImageElement = new Image(size, size);
        const id: string = click.username + this.clicks;
        uwuImg.id = id;

        // Check if user has not allowed Heat permissions
        if (click.username === "Unverified" || click.username == "Anonymous" || this.ignoredUsers.has(click.username)) {
            // uwuImg.src = "./stuff/cfbUWU500.png";
            return;
        } else {
            uwuImg.src = click.userImg;
        }

        // Set CSS styles of click indicator and add to container div
        uwuImg.style.borderRadius = "50%";
        uwuImg.style.position = "absolute";
        uwuImg.style.left = left + "px";
        uwuImg.style.top = top + "px";
        uwuImg.classList.add("click-fade-in");
        clickBox.appendChild(uwuImg);

        // Handle removing indicator
        if (!persistence) {
            setTimeout(async function(idIn: string) {
                const clickImg: HTMLElement = document.getElementById(idIn);
                clickImg.classList.remove("click-fade-in");
                clickImg.classList.add("click-fade-out");
                
                setTimeout(async function() {
                    clickBox.removeChild(clickBox.firstElementChild);
                }, displayDuration);
            }, displayDuration, id);
        }
    }

    private async getUserById(id: string): Promise<unknown> {
        // Check user map first.
        if (this.users.has(id)) return this.users.get(id);

        // Ignore invalid names.
        if (id.startsWith("A")) return { display_name: "Anonymous" };
        if (id.startsWith("U")) return { display_name: "Unverified" };

        // Query Twitch for user details.
        const url = `https://heat-api.j38.net/user/${id}`;

        // Handle response.
        const response: any = await fetch(url);
        if (response.ok) {
            const data: any = await response.json();
            data.img = await app.twitch.profilePic(data.display_name);
            this.users.set(id, data);
            Logger.heat("User for id " + id + " found: " + data.display_name);
            return data;
        } else {
            return { display_name: "Unknown" };
        }
    }
}