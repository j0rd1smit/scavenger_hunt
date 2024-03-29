import {isPresent, listenToEventOnlyOnce} from "../utils/utils";
import {useEffect, useState} from "react";


export const createHeadingHook = (): number => {
    const [state, setState] = useState<number>(0);
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

class HeadingService {
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
            this.callbacks.forEach((callback: HeadingServiceCallback) => callback(360 - heading));
        }

    }
}

export const isHeadingSuported = async (): Promise<boolean> => {
    if (window.DeviceOrientationEvent) {
        const event = await listenToEventOnlyOnce<DeviceOrientationEvent>("deviceorientationabsolute");
        return event.absolute && isPresent(event.alpha) && isPresent(event.gamma) && isPresent(event.beta);
    }

    return false;

}

export const compassIsSupportedHook = (): boolean => {
    const [compassIsSupported, setCompassIsSupported] = useState<boolean>(false);
    useEffect(() => {
        isHeadingSuported().then((isSupported: boolean) => {
            setCompassIsSupported(isSupported)
        });
    }, []);

    return compassIsSupported;
}
