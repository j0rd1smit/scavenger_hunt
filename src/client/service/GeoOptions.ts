export class GeoOptions {
    public readonly enableHighAccuracy: boolean;
    public readonly timeout: number;
    public readonly maximumAge: number;

    constructor(enableHighAccuracy: boolean = true, timeout: number = 1_000_000, maximumAge: number = 0) {
        this.enableHighAccuracy = enableHighAccuracy;
        this.timeout = timeout;
        this.maximumAge = maximumAge;
    }

}