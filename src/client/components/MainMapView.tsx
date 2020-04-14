import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import {LatLngTuple} from "leaflet";
import {getPositionPromise} from "../utils/GeoUtils";
import {GeoOptions} from "../service/GeoOptions";
import {getOrDefault} from "../utils/utils";
import {SetState} from "../utils/ReactTypes";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            width: "100%",
            height: "100%",
        },
    }),
);

interface IMainMapViewProps {
    userLocation: LatLngTuple;

    mapCenter: LatLngTuple;
    setMapCenter: SetState<LatLngTuple>;
}

function MainMapView(props: IMainMapViewProps): JSX.Element {
    const classes = useStyles();

    const whenReadyMap = async (): Promise<void> => {
        try {
            const position = await getPositionPromise(new GeoOptions())
            const latLng: LatLngTuple = [getOrDefault(position.coords.latitude, props.mapCenter[0]), getOrDefault(position.coords.longitude, props.mapCenter[1])];
            props.setMapCenter(latLng);
        } catch (e) {
            console.error(e.message);
        }
    }
    return (
        <Fragment>
            <div className={classes.root}>
                <Map
                    center={props.mapCenter}
                    whenReady={whenReadyMap}
                    zoom={18}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={props.userLocation}>
                        <Popup>A pretty CSS3 popup.<br/>Easily customizable.</Popup>
                    </Marker>
                </Map>
            </div>
        </Fragment>
    );
}

export default MainMapView;
