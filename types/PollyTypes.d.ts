export type ChosenVoice = {
    user: string;
    voice: string;
};

export type PollyParams = {
    Engine: string,
    LanguageCode: string,
    OutputFormat: string,
    SampleRate: string,
    Text: string,
    TextType: string,
    VoiceId: string
}

export type Voice = {
    name: string;
    language: string;
    gender: string;
};