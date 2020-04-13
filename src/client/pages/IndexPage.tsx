import React, {Fragment, useState, useEffect} from "react";
import {OnClickEvent} from "../utils/ReactTypes";
import NavBar from "../components/NavBar";
import {useRefState} from "../utils/ReactHelpers";

function IndexPage(): JSX.Element {
    const [value, setValue] = useState<string>("");
    const [position, refPosition, setPosition] = useRefState<Coordinates|null>(null);
    const [deviceOrientation, refDeviceOrientation, setDeviceOrientation] = useRefState<any>(undefined);
    const [rotationDuringLastGeo, setRotationDuringLastGeo] = useState<number>(0);



    useEffect((): void => {
        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
        };
        const onSuccess = (pos: Position) => {
            const coords = pos.coords;
            if (refPosition.current?.heading !== coords.heading && refDeviceOrientation.current?.rotateDegrees !== undefined){
                setRotationDuringLastGeo(refDeviceOrientation.current.rotateDegrees);
            }
            setPosition(coords);
        };
        const onError = (err: PositionError) => console.error(err.message);

        navigator.geolocation.watchPosition(onSuccess, onError, options);

        if (window.DeviceOrientationEvent){
            window.addEventListener("compassneedscalibration", function(event) {
                alert('Your compass needs calibrating! Wave your device in a figure-eight motion');
                event.preventDefault();
            }, true);
            window.addEventListener("deviceorientationabsolute", function(event: any) {
                setDeviceOrientation({
                    rotateDegrees: event.alpha === null ? null: 360 - event.alpha,
                    leftToRight: event.gamma,
                    frontToBack: event.beta,
                    absolute: event.absolute,
                })
            }, true);
        }


    }, []);




    const onClick = async (e: OnClickEvent): Promise<void> => {
        e.preventDefault();
        const res = await fetch("/api/test");
        const data = await res.json();
        setValue(data["message"]);
    }
    const differance = () => {
        if (deviceOrientation === undefined || position?.heading === null || position?.heading === undefined) {
            return 0;
        }
        const currentView = deviceOrientation.rotateDegrees;
        return  Math.abs(currentView - rotationDuringLastGeo) % 360
    }

    const currentHeading = () => {
        if (deviceOrientation === undefined || position?.heading === null || position?.heading === undefined) {
            return 0;
        }
        return (position.heading + differance()) % 360;
    }

    // @ts-ignore
    return (
        <Fragment>
            <NavBar/>
            <div>
                <p>Message: {value}</p>

                <button onClick={onClick}>test</button>
            </div>
            <div>
                <p>accuracy: {position?.accuracy}</p>
                <p>altitude: {position?.altitude}</p>
                <p>altitudeAccuracy: {position?.altitudeAccuracy}</p>
                <p>heading: {position?.heading}</p>
                <p>latitude: {position?.latitude}</p>
                <p>longitude: {position?.longitude}</p>
            </div>
           <div>
                <p>rotateDegrees: {deviceOrientation?.rotateDegrees}</p>
                <p>leftToRight: {deviceOrientation?.leftToRight}</p>
                <p>frontToBack: {deviceOrientation?.frontToBack}</p>
                <p>absolute: {deviceOrientation?.absolute? "True": "False"}</p>
               <p>compassHeading: {deviceOrientation?.compassHeading}</p>
                <p>rotationDuringLastGeo: {rotationDuringLastGeo}</p>

                <p>differance: {differance()} </p>
                <p>currentHeading: {currentHeading()}</p>

            </div>

        </Fragment>
    );
}

export default IndexPage;