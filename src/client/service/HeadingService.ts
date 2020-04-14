import {isPresent} from "../utils/utils";
import {useEffect, useState} from "react";


export const createHeadingHook = (): number => {
    const [state, setState] = useState<number>(-1);
    useEffect((): () => void => {
        const callback = (data: number): void => setState(data);
        const service = new HeadingService([callback]);
        service.start();

        return () => {
            service.stop();
        };
    }, []);

    return state;
}

export type HeadingServiceCallback = (data: number) => void;

export default class HeadingService {
    private callbacks: HeadingServiceCallback[];

    private supportAbsoluteDeviceOrientation: boolean = !!window.DeviceOrientationEvent;


    constructor(callbacks: undefined | HeadingServiceCallback[]) {
        this.callbacks = callbacks !== undefined ? callbacks : [];
    }

    public askForPremission = async (): Promise<[PermissionStatus, PermissionStatus, PermissionStatus]> => {
        return await Promise.all([
            navigator.permissions.query({name: "accelerometer"}),
            navigator.permissions.query({name: "magnetometer"}),
            navigator.permissions.query({name: "gyroscope"})]);
    }


    public start = (): void => {
        if (this.supportAbsoluteDeviceOrientation) {
            window.addEventListener("deviceorientationabsolute", this.onSucessDeviceorientationabsolute, true);
        }
    }

    public stop = (): void => {
        window.removeEventListener("deviceorientationabsolute", this.onSucessDeviceorientationabsolute)
    }

    private onSucessDeviceorientationabsolute = (event: DeviceOrientationEvent): void => {
        if (!event.absolute) {
            this.supportAbsoluteDeviceOrientation = false;
            this.stop();
            this.start();
        }
        if (event.absolute && isPresent(event.alpha)) {
            const heading = event.alpha;
            this.callbacks.forEach((callback: HeadingServiceCallback) => callback(heading));
        }

    }
}