import { secrets } from "../../data/secrets/secrets.js";
import { Util } from "../util/Util.js";

export class OpenAI {
    private apiKey: string;
    private model: string = "gpt-3.5-turbo";

    constructor() {
        this.apiKey = secrets.openAI.apiKey;
    }

    public async isModerationFlagged(contentToModerate: string): Promise<boolean> {
        const endpoint: string = "https://api.openai.com/v1/moderations";
        const endpoint2: string = "https://api.openai.com/v1/engines/gpt-3.5-turbo/moderation";
        const requestData = {
            input: contentToModerate
        };
        const response = await Util.Requests.post({
            url: endpoint,
            body: JSON.stringify(requestData),
            authentication: this.apiKey
        });
        const jsonObj = JSON.parse(response.responseText);
        const isFlagged = jsonObj.results.flagged;
        return isFlagged;
    }

    public async chat(prompt: string): Promise<any> {
        const endpoint: string = "https://api.openai.com/v1/chat/completions";
        if (await this.isModerationFlagged(prompt) === true) {
            return "I'm sorry, but this request violates my API's content moderation rules.";
        }
        const additionalText: string = ". Also please keep your response under 300 characters.";
        prompt += additionalText;
        const requestData = {
            model: this.model,
            messages: [{ role: "assistant", content: prompt }]
        };
        const response = await Util.Requests.post({
            url: endpoint,
            body: JSON.stringify(requestData),
            authentication: this.apiKey
        });
        const jsonObj = JSON.parse(response.responseText);
        const message = jsonObj.choices[0].message.content;
        return message;
    }

}