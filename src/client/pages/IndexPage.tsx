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
import {AssignmentTurnedIn, Navigation} from "@material-ui/icons";
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
            //bottom: 58 + theme.spacing(2),
            right: theme.spacing(2),
        },
        fabAnswerQuestion: {
            zIndex: 402,
            position: 'absolute',
            //bottom: 56 + 2 * 58 + theme.spacing(2) + theme.spacing(2),
            right: theme.spacing(2),
        }
    }),
);

interface IIndexPageProps {

}

function IndexPage(_: IIndexPageProps): JSX.Element {
    const classes = useStyles();
    const spacing = 8;
    const fabSize = 56;

    const geoData = createGeoDataHook();

    //container related
    const mapHeight = windowHeightMinusAppBarState();

    //selected location
    const [selectedLocation, setSelectedLocation] = useState<ILocation|undefined>();
    const onClickCloseLocationTrackingBtn = (): void => setSelectedLocation(undefined);
    const selectedLocationOffSet = selectedLocation === undefined ? spacing : 56;

    //map related
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([0., 0.]);
    const [followUser, setFollowUser] = useState<boolean>(true);
    const onClickFabCenterBtn = (_: OnClickEvent): void => setFollowUser(true);
    const withingDistanceRange = 1000;
    const isInSearchArea = selectedLocation !== undefined && distanceInMetersBetween(selectedLocation.coords, geoData.coord) <= withingDistanceRange;

    // Dialog
    const [puzzelDialogIsOpen, setPuzzelDialogIsOpen] = useState<boolean>(false);

    const onClickFabAnswerQuestion = (e: OnClickEvent): void => setPuzzelDialogIsOpen(true);

    // drawer
    const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
    const onClickMenuButton: OnClickCallback = (_: OnClickEvent): void => {
        setDrawerIsOpen(true);
    };

    const [locations, setLocations] = useState<ILocation[]>([
            {
                name: "Hockey club",
                coords: [52.210860, 4.426798],
                isUnlocked: false,
                isCompleted: false,
                code: "001",
                question: {
                    type: "OPEN",
                    description: "The answer is test",
                    answer: "test",
                }
            },
            {
                name: "Voetbalveld brug",
                coords: [52.211344, 4.420593],
                isUnlocked: false,
                isCompleted: false,
                code: "001",
                question: {
                    type: "QR_CODE",
                    description: "Find the QR code?",
                    answer: "test",
                }
            },
            {
                name: "Polster",
                coords: [52.211920, 4.418950],
                isUnlocked: false,
                isCompleted: false,
                code: "001",
                question: {
                    type: "OPEN",
                    description: "Solve the rebus.",
                    img: "/static/images/rebus10.jpg",
                    answer: "Ze blijft om de hete brij heendraaien",
                }
            },
            {
                name: "Lidl",
                coords: [52.212494, 4.417784],
                isUnlocked: false,
                isCompleted: false,
                code: "001",
                question: {
                    type: "OPEN",
                    description: "The answer is test",
                    answer: "test",
                }
            },
            {
                name: "Bushalt",
                coords: [52.213809, 4.422414],
                isUnlocked: false,
                isCompleted: false,
                code: "001",
                question: {
                    type: "OPEN",
                    description: "The answer is test",
                    answer: "test",
                }
            }
        ]);

    if (selectedLocation !== undefined && !selectedLocation.isUnlocked && isInSearchArea) {
        locations.filter(e => e === selectedLocation)[0].isUnlocked = true;
        selectedLocation.isUnlocked = true;
        setLocations(locations);
        setSelectedLocation(selectedLocation);
        setPuzzelDialogIsOpen(true);
    }

    const markLocationAsCompleted = (location: ILocation) => {
        if (selectedLocation === location) {
            selectedLocation.isCompleted = true;
            setSelectedLocation(selectedLocation);
        }
    }
    //TODO create an alert if the compass is not suported.

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
                {selectedLocation !== undefined &&
                    <PuzzelDialog
                        markLocationAsCompleted={markLocationAsCompleted}
                        location={selectedLocation}
                        isOpen={puzzelDialogIsOpen}
                        setIsOpen={setPuzzelDialogIsOpen}
                    />
                }

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
                            isCompleted={selectedLocation.isCompleted}
                            isInSearchArea={isInSearchArea}
                            onClickClose={onClickCloseLocationTrackingBtn}
                            name={selectedLocation.name}
                            distance={distanceInMetersBetween(geoData.coord, selectedLocation.coords)}
                        />
                    </div>
                    }
                    {selectedLocation !== undefined &&
                        <Fab
                            className={classes.fabAnswerQuestion}
                            color="primary"
                            aria-label="center"
                            onClick={onClickFabAnswerQuestion}
                            style={{
                                bottom: selectedLocationOffSet + 4 * spacing  + fabSize,
                            }}
                        >
                            <AssignmentTurnedIn/>
                        </Fab>
                    }

                    <Fab
                        className={classes.fabCenter}
                        color="primary"
                        aria-label="center"
                        onClick={onClickFabCenterBtn}
                        style={{
                            bottom: selectedLocationOffSet + 2 * spacing,
                        }}
                    >
                        <Navigation/>
                    </Fab>
                    <MainMapView
                        userLocation={geoData}
                        locations={locations}
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