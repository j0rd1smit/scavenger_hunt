import GeoData from "./GeoData";
import {GeoOptions} from "./GeoOptions";
import {useEffect, useState,} from "react";
import {getOrDefault} from "../utils/utils";

export const askForPremission = async (): Promise<PermissionStatus> => {
    return navigator.permissions.query({name:'geolocation'});
}

export const createGeoDataHook = (options: GeoOptions|undefined = undefined): GeoData => {
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
    private wacthNumber: undefined|number;

    constructor(options: GeoOptions, callbacks: undefined|GeolocationServiceCallback[]) {
        this.options = options;
        this.callbacks = callbacks !== undefined? callbacks : [];
        this.wacthNumber = undefined;
    }



    public start = (): void => {
        this.wacthNumber = navigator.geolocation.watchPosition(this.onSuccess, this.onError, this.options);
    }

    private onSuccess = (pos: Position) => {
        if (pos.coords?.accuracy !== undefined && pos.coords.latitude !== undefined && pos.coords.longitude != undefined) {
            const data = new GeoData(pos.coords.accuracy, [pos.coords.latitude, pos.coords.longitude]);
            this.callbacks.forEach((callback: GeolocationServiceCallback) => callback(data))
        }
    }

    //TODO
    private onError = (err: PositionError) => console.error(err.message);

    public stop = (): void => {
        if (this.wacthNumber !== undefined) {
            navigator.geolocation.clearWatch(this.wacthNumber);
            this.wacthNumber = undefined;
        }
    }
}