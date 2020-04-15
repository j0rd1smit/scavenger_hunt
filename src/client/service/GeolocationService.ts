import GeoData from "./GeoData";
import {GeoOptions} from "./GeoOptions";
import {useEffect, useState,} from "react";
import {getOrDefault} from "../utils/utils";
import {distanceInMetersBetween} from "../utils/GeoUtils";

export const askForPremission = async (): Promise<PermissionStatus> => {
    return navigator.permissions.query({name: 'geolocation'});
}

export const createGeoDataHook = (options: GeoOptions | undefined = undefined): GeoData => {
    const [state, setState] = useState<GeoData>(GeoData.empty());
    useEffect((): () => void => {
        const callback = (data: GeoData): void => setState(data);
        const service = new GeolocationService(getOrDefault(options, new GeoOptions()), [callback]);
        service.start();

        return () => {
            service.stop();
        };
    }, []);

    return state;
}


type GeolocationServiceCallback = (data: GeoData) => void;

export default class GeolocationService {
    private readonly options: GeoOptions;
    private callbacks: GeolocationServiceCallback[];
    private wacthNumber: undefined | number;
    private lastLocation: GeoData;

    constructor(options: GeoOptions, callbacks: undefined | GeolocationServiceCallback[]) {
        this.options = options;
        this.callbacks = callbacks !== undefined ? callbacks : [];
        this.wacthNumber = undefined;
        this.lastLocation = GeoData.empty();
    }


    public start = (): void => {
        this.wacthNumber = navigator.geolocation.watchPosition(this.onSuccess, this.onError, this.options);
    }

    public stop = (): void => {
        if (this.wacthNumber !== undefined) {
            navigator.geolocation.clearWatch(this.wacthNumber);
            this.wacthNumber = undefined;
        }
    }

    private onSuccess = (pos: Position) => {
        if (pos.coords?.accuracy !== undefined && pos.coords.latitude !== undefined && pos.coords.longitude != undefined) {
            const data = new GeoData(pos.coords.accuracy, [pos.coords.latitude, pos.coords.longitude]);
            if (distanceInMetersBetween(data.coord, this.lastLocation.coord) > 5) {
                this.callbacks.forEach((callback: GeolocationServiceCallback) => callback(data));
                this.lastLocation = data;
            }

        }
    }

    //TODO
    private onError = (err: PositionError) => console.error(err.message);
}