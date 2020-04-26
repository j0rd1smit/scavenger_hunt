import React, {Fragment, useEffect, useRef, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {CircleMarker, Map, Marker, Popup, TileLayer, Viewport} from "react-leaflet";
import {LatLngTuple} from "leaflet";
import {isPresent} from "../utils/utils";
import {SetState} from "../utils/ReactTypes";
import L from 'leaflet'
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";
import {createGeoDataHook} from "../service/GeolocationService";
import {ILocation} from "../../utils/Locations";
import {bearingFromTo, distanceInMetersBetween} from "../utils/GeoUtils";
import {compassIsSupportedHook} from "../service/HeadingService";
import GeoData from "../service/GeoData";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            width: "100%",
            height: "100%",
        },
        directionIcon: {
            "background-color": "transparent",
            border: 0,
        }
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
        const prevUserLocation = useRef<undefined|GeoData>(undefined);

        useEffect(() => {
            if (prevUserLocation.current === undefined) {
                console.log("init prevUserLocation")
                prevUserLocation.current = userLocation;
            }
            if (distanceInMetersBetween(prevUserLocation.current.coord, userLocation.coord) > 25) {
                setMapCenter(userLocation.coord);
                console.log("update prevUserLocation")
                prevUserLocation.current = userLocation;
            }
        }, [userLocation]);


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

        const compassIsSupported = compassIsSupportedHook();
        const createUserLocationMarker = () => {
            if (compassIsSupported || selectedLocation === null || selectedLocation === undefined) {
                return (
                    <Fragment key={"userLocationMarker"}>
                        <Marker  position={userLocation.coord}>
                            <Popup>You are currently here.</Popup>
                        </Marker>
                        <CircleMarker center={userLocation.coord} fillColor="blue"
                                      radius={userLocation.accuracy / metresPerPixel}/>
                    </Fragment>
                );
            }

            const bearing = bearingFromTo(userLocation.coord, selectedLocation.coords);
            const size = 24;
            const userIcon = L.divIcon({
                className: classes.directionIcon,
                iconAnchor: [size / 2, size / 2],
                iconSize: [size, size],
                html: `<img alt="direction_icon" style="transform: rotate(${bearing}deg);" height="${size}"  width="${size}" src='/static/images/arrow4.png'/>`
            });

            return (
                <Fragment key={"directionMarker"}>
                    <Marker  position={userLocation.coord} icon={userIcon}>
                        <Popup>This is the direction towards the selected location.</Popup>
                    </Marker>
                    <CircleMarker center={userLocation.coord} fillColor="blue"
                                  radius={userLocation.accuracy / metresPerPixel}/>
                </Fragment>
            );
        }




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
                        {createUserLocationMarker()}

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
