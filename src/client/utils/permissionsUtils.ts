import {useEffect, useState} from "react";
import {sleep} from "./utils";


export type GeoPermissionRequesetStatus = "Asking"|"Granted"|"Denied";

export const permissionStatusHook = (): GeoPermissionRequesetStatus => {
    const [permissionStatus, setPermissionStatus] = useState<GeoPermissionRequesetStatus>("Asking");

    useEffect(() => {
        const onSucess = (position: Position): void => {
            setPermissionStatus("Granted");
        };
        const onError = async (positionError: PositionError): Promise<void> => {
            setPermissionStatus("Denied");
            console.log("Denied");
            await sleep(2500);
            navigator.geolocation.getCurrentPosition(onSucess, onError);
        };
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    }, []);

    return permissionStatus;
}

