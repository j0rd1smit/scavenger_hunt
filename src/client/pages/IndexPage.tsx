import React, {Fragment, useState} from "react";
import NavBar from "../components/NavBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import {LatLngTuple} from "leaflet";
import SideBarDrawer from "../components/SideBarDrawer";
import MainMapView from "../components/MainMapView";
import PuzzelDialog from "../components/PuzzelDialog";
import CompassPullOver from "../components/CompassPullOver";
import LocationPullOver from "../components/LocationPullOver";
import {Fab} from "@material-ui/core";
import {CameraAlt, Navigation} from "@material-ui/icons";
import QRCodeDailog from "../components/QRCodeDailog";
import {windowHeightMinusAppBarState} from "../utils/ReactHelpers";
import {ILocation} from "../utils/locations";
import {bearingFromTo, distanceInMetersBetween} from "../utils/GeoUtils";
import {createGeoDataHook} from "../service/GeolocationService";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        mapContainer: {
            position: "relative",
            width: "100%",
        },
        fabCenter: {
            zIndex: 402,
            position: 'absolute',
            bottom: 58 + theme.spacing(2),
            right: theme.spacing(2),
        },
        fabCamera: {
            zIndex: 402,
            position: 'absolute',
            bottom: 56 + 58 + theme.spacing(2) + theme.spacing(1),
            right: theme.spacing(2),
        },
    }),
);

interface IIndexPageProps {

}

function IndexPage(props: IIndexPageProps): JSX.Element {
    const classes = useStyles();

    const geoData = createGeoDataHook();

    //container related
    const mapHeight = windowHeightMinusAppBarState();

    //selected location
    const [selectedLocation, setSelectedLocation] = useState<ILocation|undefined>();
    const onClickCloseLocationTrackingBtn = (): void => setSelectedLocation(undefined);

    //map related
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([0., 0.]);
    const [followUser, setFollowUser] = useState<boolean>(true);
    const onClickFabCenterBtn = (e: OnClickEvent): void => setFollowUser(true);

    // Dialog
    const [puzzelDialogIsOpen, setPuzzelDialogIsOpen] = useState<boolean>(false);
    const [QRCodeDialogIsOpen, setQRCodeDialogIsOpen] = useState<boolean>(false);

    // drawer
    const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
    const onClickMenuButton: OnClickCallback = (e: OnClickEvent): void => {
        setDrawerIsOpen(true);
    };

    //QR code
    const onClickFabCamera = (e: OnClickEvent): void => {
        setQRCodeDialogIsOpen(true);
    };

    const locations: ILocation[] = [
        {
            name: "Hockey club",
            coords: [52.210860, 4.426798],
            isCompleted: false,
        },
        {
            name: "Voetbalveld brug",
            coords: [52.211344, 4.420593],
            isCompleted: false,
        },
        {
            name: "Polster",
            coords: [52.211920, 4.418950],
            isCompleted: false,
        },
        {
            name: "Lidl",
            coords: [52.212494, 4.417784],
            isCompleted: false,
        },
        {
            name: "Bushalt",
            coords: [52.213809, 4.422414],
            isCompleted: false,
        }
    ];

    return (
        <Fragment>
            <div className={classes.root}>
                <NavBar
                    onMenuButtonClick={onClickMenuButton}
                />
                <SideBarDrawer
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    userLocation={geoData.coord}
                    locations={locations}
                    isOpen={drawerIsOpen}
                    setIsOpen={setDrawerIsOpen}
                />
                <PuzzelDialog
                    isOpen={puzzelDialogIsOpen}
                    setIsOpen={setPuzzelDialogIsOpen}
                />
                <QRCodeDailog isOpen={QRCodeDialogIsOpen} setIsOpen={setQRCodeDialogIsOpen}/>

                <div
                    className={classes.mapContainer}
                    style={{height: mapHeight}}
                >
                    {selectedLocation !== undefined &&
                    <div>
                        <CompassPullOver
                            bearingComparedToCurrentLocation={bearingFromTo(geoData.coord, selectedLocation.coords)}
                        />
                        <LocationPullOver
                            onClickClose={onClickCloseLocationTrackingBtn}
                            name={selectedLocation.name}
                            distance={distanceInMetersBetween(geoData.coord, selectedLocation.coords)}
                        />
                    </div>
                    }

                    <Fab
                        className={classes.fabCenter}
                        color="primary"
                        aria-label="center"
                        onClick={onClickFabCenterBtn}
                    >
                        <Navigation/>
                    </Fab>
                    <Fab
                        className={classes.fabCamera}
                        color="primary"
                        onClick={onClickFabCamera}
                        aria-label="Scan QR code">
                        <CameraAlt/>
                    </Fab>
                    <MainMapView
                        userLocation={geoData.coord}
                        mapCenter={mapCenter}
                        followUser={followUser}
                        setFollowUser={setFollowUser}
                        setMapCenter={setMapCenter}
                    />
                </div>

            </div>

        </Fragment>
    );
}

export default IndexPage;