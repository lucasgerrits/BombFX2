import { Util } from './Util.js';

export class Colors {

    public static hexToInt(hex: string): number {
        let rgb: Array<number> = Colors.hexToRGB(hex);
        let int: number = Colors.rgbToInt(rgb[0], rgb[1], rgb[2]);
        return int;
    }

    public static hexToRGB(hex: string): Array<number> {
        let chunks: Array<number> = new Array<number>();
        let tmp: any;

        // Check if hex prefixed with #
        let c: number = hex.search("#");
        if (c != -1) {
            hex = hex.substr(1);
        }

        // Determine length of hex (3 vs 6)
        if (hex.length === 3) {
            tmp = hex.split("");
            for (let i: number = 0; i < 3; i++) {
                chunks.push(parseInt(tmp[i] + "" + tmp[i], 16));
            }
        } else if (hex.length === 6) {
            tmp = hex.match(/.{2}/g);
            for (let i: number = 0; i < 3; i++) {
                chunks.push(parseInt((tmp[i] as string), 16));
            }
        } else {
            chunks = [-1, -1, -1]
        }

        return chunks;
    }

    public static rgbToInt(red: number, green: number, blue: number): number {
        const r: number = red & 0xFF;
        const g: number = green & 0xFF;
        const b: number = blue & 0xFF;
        let rgb = (r) + (g << 8) + (b << 16);
        rgb = rgb + 4278190080;
        return rgb;
    }
}
