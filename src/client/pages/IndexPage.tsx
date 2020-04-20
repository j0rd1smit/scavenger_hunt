import React, {Fragment, useState} from "react";
import NavBar from "../components/NavBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import SideBarDrawer from "../components/SideBarDrawer";
import MainMapView from "../components/MainMapView";
import PuzzelDialog from "../components/PuzzelDialog";
import CompassPullOver from "../components/CompassPullOver";
import LocationPullOver from "../components/LocationPullOver";
import {Fab} from "@material-ui/core";
import {Navigation, RateReview} from "@material-ui/icons";
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
            right: theme.spacing(2),
        },
        fabAnswerQuestion: {
            zIndex: 402,
            position: 'absolute',
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

    // Dialog
    const [puzzelDialogIsOpenFor, setPuzzelDialogIsOpenFor] = useState<ILocation|undefined>(undefined);
    const onClickFabAnswerQuestion = (e: OnClickEvent): void => setPuzzelDialogIsOpenFor(selectedLocation);

    //map related
    const [followUser, setFollowUser] = useState<boolean>(true);
    const onClickFabCenterBtn = (_: OnClickEvent): void => setFollowUser(true);
    const withingDistanceRange = 1000;
    const isInSearchArea = selectedLocation !== undefined && distanceInMetersBetween(selectedLocation.coords, geoData.coord) <= withingDistanceRange;
    const ondblclickSearchArea = (location: ILocation): void => {
        if (selectedLocation !== location) {
            setSelectedLocation(location);
        }
        if (puzzelDialogIsOpenFor !== location) {
            setPuzzelDialogIsOpenFor(location);
        }
    }



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
                    answer: "test",
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

    const locationsInTheArea = locations.filter(location => !location.isUnlocked && distanceInMetersBetween(location.coords, geoData.coord) <= withingDistanceRange);
    if (locationsInTheArea.length > 0) {
        locationsInTheArea.forEach(location => {
            location.isUnlocked = true;
            if (location === selectedLocation) {
                setPuzzelDialogIsOpenFor(selectedLocation);
            }
        });
        setLocations(locations);
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
                    setPuzzelDialogIsOpenFor={setPuzzelDialogIsOpenFor}
                    selectedLocation={selectedLocation}
                    setSelectedLocation={setSelectedLocation}
                    userLocation={geoData.coord}
                    locations={locations}
                    isOpen={drawerIsOpen}
                    setIsOpen={setDrawerIsOpen}
                />
                {locations.map(location => {
                    return (
                        <PuzzelDialog
                            key={location.name}
                            markLocationAsCompleted={markLocationAsCompleted}
                            location={location}
                            isOpen={puzzelDialogIsOpenFor === location}
                            setPuzzelDialogIsOpenFor={setPuzzelDialogIsOpenFor}
                        />
                    );
                })}

                <div
                    className={classes.mapContainer}
                    style={{height: mapHeight}}
                >
                    {selectedLocation !== undefined && selectedLocation.isCompleted &&
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
                            <RateReview/>
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
                        ondblclickSearchArea={ondblclickSearchArea}
                        withingDistanceRange={withingDistanceRange}
                        userLocation={geoData}
                        locations={locations}
                        followUser={followUser}
                        setFollowUser={setFollowUser}
                    />
                </div>

            </div>

        </Fragment>
    );
}

export default IndexPage;