import {LatLng} from "../utils/GeoUtils";

export default class GeoData {
    public readonly accuracy: number;
    public readonly coord: LatLng;
    public readonly longitude: number;

    constructor(accuracy: number, coord: LatLng) {
        this.accuracy = accuracy;
        this.coord = coord;
    }

    public static empty = (): GeoData => {
        return new GeoData(-1, [0, 0]);
    }
}
