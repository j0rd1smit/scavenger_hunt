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
            const imgSrc = "data:image/png;base64,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";
            const userIcon = L.divIcon({
                className: classes.directionIcon,
                iconAnchor: [size / 2, size / 2],
                iconSize: [size, size],
                html: `<img alt="direction_icon" style="transform: rotate(${bearing}deg);" height="${size}"  width="${size}" src="${imgSrc}"/>`
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
