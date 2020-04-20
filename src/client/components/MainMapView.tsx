import React, {Fragment, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CircleMarker, Map, Marker, Popup, TileLayer, Viewport} from "react-leaflet";
import {LatLngTuple} from "leaflet";
import {isPresent} from "../utils/utils";
import {SetState} from "../utils/ReactTypes";
import GeoData from "../service/GeoData";
import {ILocation} from "../utils/locations";

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
    userLocation: GeoData;

    followUser: boolean;
    setFollowUser: SetState<boolean>;

    mapCenter: LatLngTuple;
    setMapCenter: SetState<LatLngTuple>;

    locations: ILocation[];
}

function MainMapView(props: IMainMapViewProps): JSX.Element {
    const classes = useStyles();
    const {setMapCenter, setFollowUser, followUser, userLocation, mapCenter} = props;

    const [zoom, setZoom] = useState<number>(18);

    const center = followUser ? userLocation.coord : mapCenter;
    if (followUser && (userLocation.coord[0] !== mapCenter[0] || userLocation.coord[1] !== mapCenter[1])) {
        setMapCenter(userLocation.coord);
    }

    const onViewportChanged = (viewport: Viewport): void => {
        if (isPresent(viewport.zoom)) {
            setZoom(viewport.zoom);
        }

        if (isPresent(viewport.center)) {
            setMapCenter(viewport.center);
        }
    }
    const metresPerPixel = 40075016.686 * Math.abs(Math.cos(center[0] * Math.PI/180)) / Math.pow(2, zoom+8);
    return (
        <Fragment>
            <div className={classes.root}>
                <Map
                    center={center}
                    zoom={zoom}
                    onViewportChanged={onViewportChanged}
                    ondrag={event => setFollowUser(false)}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={props.userLocation.coord}>
                        <Popup>You are currently here.</Popup>
                    </Marker>
                    <CircleMarker center={props.userLocation.coord} fillColor="blue" radius={props.userLocation.accuracy / metresPerPixel} />
                </Map>
            </div>
        </Fragment>
    );
}

export default MainMapView;
