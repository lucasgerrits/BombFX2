export class Numbers {

    public static getRandomIntegerInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // Min and max are inclusive
    }
    
    public static msToMinSec(ms: number): string {
        const minutes: number = Math.floor(ms / 60000);
        const seconds: number = Math.floor((ms / 1000) - (minutes * 60));
        //return "hi";
        return minutes.toString().padStart(2, "0") + " minutes " +
            seconds.toString().padStart(2, "0") + " seconds";
    }

    public static hoursToMS(hours: number): number {
        return hours * (60 * (60 * 1000));
    }

    public static minToMS(minutes: number): number {
        return minutes * (60 * 1000);
    }

    public static secToMS(seconds: number): number {
        return seconds * 1000;
    }

    public static secToHMS(seconds: number): string {
        return new Date(seconds * 1000).toISOString().slice(11, 19);
    }
}