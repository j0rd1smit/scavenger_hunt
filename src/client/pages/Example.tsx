import React, {Fragment, useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {askForPremission, createGeoDataHook} from "../service/GeolocationService";
import {OnClickEvent} from "../utils/ReactTypes";
import {createHeadingHook} from "../service/HeadingService";
import {bearingFromTo, differanceBetweenAngle, distanceInMetersBetween} from "../utils/GeoUtils";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

function Example(): JSX.Element {
    const classes = useStyles();
    const [show, setShow] = useState<boolean>(true);
    const geoData = createGeoDataHook();
    const heading = createHeadingHook();

    useEffect((): void => {
        (async (): Promise<void> => {
            try {
                const result = await askForPremission();
                console.log(result);
            } catch (e) {
                console.log(e.message);
            }
        })();

    }, []);

    const onClick = (e: OnClickEvent): void => {
        e.preventDefault();
        setShow(!show);
    }

    return (
        <Fragment>
            <div className={classes.root}>
                <div>
                    <button onClick={onClick}>test</button>
                </div>
                {show?
                    <div>
                        <p>accuracy: {geoData.accuracy}</p>
                        <p>latitude: {geoData.coord[0]}</p>
                        <p>longitude: {geoData.coord[1]}</p>
                        <p>heading: {heading}</p>
                        <p>bearing-off brug: {differanceBetweenAngle(bearingFromTo(geoData.coord, [52.212222, 4.419776]), heading)}</p>
                        <p>distance brug: {distanceInMetersBetween(geoData.coord, [52.212222, 4.419776])}</p>
                        <p>bearing-off hockey: {differanceBetweenAngle(bearingFromTo(geoData.coord, [52.211172, 4.426458]), heading)}</p>
                        <p>distance hockey: {distanceInMetersBetween(geoData.coord, [52.211172, 4.426458])}</p>
                    </div>
                    :
                    <div/>
                }
            </div>
        </Fragment>
    );
}

export default Example;
