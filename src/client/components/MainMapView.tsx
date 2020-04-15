import React, {Fragment, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Map, Marker, Popup, TileLayer, Viewport} from "react-leaflet";
import {LatLngTuple} from "leaflet";
import {isPresent} from "../utils/utils";
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

    followUser: boolean;
    setFollowUser: SetState<boolean>;

    mapCenter: LatLngTuple;
    setMapCenter: SetState<LatLngTuple>;
}

function MainMapView(props: IMainMapViewProps): JSX.Element {
    const classes = useStyles();
    const {setMapCenter, setFollowUser, followUser, userLocation, mapCenter} = props;

    const [zoom, setZoom] = useState<number>(18);

    const center = followUser? userLocation : mapCenter;

    const onViewportChanged = (viewport: Viewport): void => {
        if (isPresent(viewport.zoom)) {
            setZoom(viewport.zoom);
        }

        if (isPresent(viewport.center)) {
            setFollowUser(false);
            setMapCenter(viewport.center);
        }
    }

    return (
        <Fragment>
            <div className={classes.root}>
                <Map
                    center={center}
                    zoom={zoom}
                    onViewportChanged={onViewportChanged}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={props.userLocation}>
                        <Popup>You are currently here.</Popup>
                    </Marker>
                </Map>
            </div>
        </Fragment>
    );
}

export default MainMapView;
