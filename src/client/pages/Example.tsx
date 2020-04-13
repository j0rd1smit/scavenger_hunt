import React, {Fragment, useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

function Example(): JSX.Element {
    try {
        const classes = useStyles();
        const [deviceOrientation, setDeviceOrientation] = useState<any>();
        const [deviceRelOrientation, setDeviceRelOrientation] = useState<any>();
        const [errorMsg, setErrorMsg] = useState<string>("");
        const [errorRelMsg, setErrorRelMsg] = useState<string>("");

        useEffect((): void => {
            Promise.all([
                navigator.permissions.query({ name: "accelerometer" }),
                navigator.permissions.query({ name: "magnetometer" }),
                navigator.permissions.query({ name: "gyroscope" })])
                .then(results => {
                    if (results.every(result => result.state === "granted")) {
                        const options = { frequency: 60, referenceFrame: 'device' };
                        // @ts-ignore
                        const sensor = new AbsoluteOrientationSensor(options);
                        // @ts-ignore
                        const sensor2 = new RelativeOrientationSensor(options);


                        sensor.addEventListener('reading', () => {
                            // model is a Three.js object instantiated elsewhere.
                            //model.quaternion.fromArray(sensor.quaternion).inverse();
                            const mat4 = new Float32Array(16);
                            sensor.populateMatrix(mat4);
                            setDeviceOrientation(mat4);
                        });
                        sensor.addEventListener('error', (err: Error) => {
                            if (err.name == 'NotReadableError') {
                                setErrorMsg("Sensor is not available.");
                            }
                        });
                        sensor2.addEventListener('reading', () => {
                            // model is a Three.js object instantiated elsewhere.
                            //model.quaternion.fromArray(sensor.quaternion).inverse();
                            const mat4 = new Float32Array(16);
                            sensor2.populateMatrix(mat4);
                            setDeviceRelOrientation(mat4);
                        });
                        sensor2.addEventListener('error', (err: Error) => {
                            if (err.name == 'NotReadableError') {
                                setErrorRelMsg("Sensor is not available.");
                            }
                        })
                        sensor.start();
                        sensor2.start();

                    } else {
                        setErrorMsg("No permissions to use AbsoluteOrientationSensor.");
                    }
                }).catch(e => setErrorMsg(e.message));

        }, []);
        if (deviceOrientation === undefined) {
            return (
                <Fragment>
                    <div className={classes.root}>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <Fragment>
                    <div className={classes.root}>
                        <p>errorMsg: {errorMsg}</p>
                        <p>errorRelMsg: {errorRelMsg}</p>
                        <p>deviceOrientation: {deviceOrientation[0]}</p>
                        <p>deviceOrientation: {deviceOrientation[1]}</p>
                        <p>deviceOrientation: {deviceOrientation[2]}</p>
                        <p> </p>
                        <p>deviceRelOrientation: {JSON.stringify(deviceRelOrientation)}</p>

                    </div>
                </Fragment>
            );
        }
    } catch (e) {
        return (
            <Fragment>
                {e.message}
            </Fragment>
        )
    }


}

export default Example;
