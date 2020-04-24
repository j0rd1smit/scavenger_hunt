import React, {Fragment, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CircleMarker, Map, Marker, Popup, TileLayer, Viewport} from "react-leaflet";
import {LatLngTuple} from "leaflet";
import {isPresent} from "../utils/utils";
import {SetState} from "../utils/ReactTypes";
import L from 'leaflet'
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";
import {createGeoDataHook} from "../service/GeolocationService";
import {ILocation} from "../../utils/Locations";

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

    followUser: boolean;
    setFollowUser: SetState<boolean>;

}

function MainMapView(props: IMainMapViewProps): JSX.Element {
        const classes = useStyles();
        const [state, {setSelectedLocation, setPuzzelDialogIsOpenFor}] = useGlobalGameStore();
        const {locations, selectedLocation} = state.gameState;

        const {setFollowUser, followUser,} = props;
        const userLocation = createGeoDataHook();


        const [zoom, setZoom] = useState<number>(18);
        const [mapCenter, setMapCenter] = useState<LatLngTuple>(followUser ? userLocation.coord : [0., 0.]);

        const center = followUser ? userLocation.coord : mapCenter;
        if (followUser && (userLocation.coord[0] !== mapCenter[0] || userLocation.coord[1] !== mapCenter[1])) {
            setMapCenter(userLocation.coord);
        }

       const ondblclickSearchArea = (location: ILocation): void => {
            if (selectedLocation !== location) {
                setSelectedLocation(location);
            }
            if (state.puzzelDialogIsOpenFor !== location.name) {
                setPuzzelDialogIsOpenFor(location);
            }
        }

        const onViewportChanged = (viewport: Viewport): void => {
            if (isPresent(viewport.zoom)) {
                setZoom(viewport.zoom);
            }

            if (isPresent(viewport.center)) {
                setMapCenter(viewport.center);
            }
        }

        const metresPerPixel = 40075016.686 * Math.abs(Math.cos(center[0] * Math.PI / 180)) / Math.pow(2, zoom + 8);

        const completedIcon = new L.Icon({
            iconUrl: '/static/images/check_circle_marker.svg',
            iconRetinaUrl: '/static/images/check_circle_marker.svg',
            iconAnchor: [15 / metresPerPixel, 15 / metresPerPixel],
            popupAnchor: [0, -7.5 / metresPerPixel],
            iconSize: [30 / metresPerPixel, 30 / metresPerPixel],
            shadowSize: [29, 40 / metresPerPixel],
            shadowAnchor: [7, 40],
        });

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
                        <Marker position={userLocation.coord}>
                            <Popup>You are currently here.</Popup>
                        </Marker>
                        <CircleMarker center={userLocation.coord} fillColor="blue"
                                      radius={userLocation.accuracy / metresPerPixel}/>
                        {
                            locations.filter(e => e.isCompleted).map(location => {
                                return (
                                    <Marker key={location.name} position={location.coords} icon={completedIcon}>
                                        <Popup autoPan={false}>
                                            Completed: {location.name}
                                        </Popup>
                                    </Marker>
                                );
                            })
                        }
                        {
                            locations.filter(e => !e.isCompleted && e.isUnlocked).map(location => {
                                return (
                                    <CircleMarker
                                        key={location.name}
                                        color={"gray"}
                                        fillColor="gray"
                                        center={location.coords}
                                        radius={1.5 * location.unlockingDistanceInMeters / metresPerPixel}
                                        icon={completedIcon}
                                        ondblclick={(e: L.LeafletMouseEvent) => ondblclickSearchArea(location)}
                                    >
                                        <Popup autoPan={false} offset={[0, 0]}>
                                            Discovered: {location.name}
                                        </Popup>
                                    </CircleMarker>
                                );
                            })
                        }
                    </Map>
                </div>
            </Fragment>
        );

}

export default MainMapView;
