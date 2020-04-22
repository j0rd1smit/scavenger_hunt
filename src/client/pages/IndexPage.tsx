import React, {Fragment, useEffect, useState} from "react";
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
import {bearingFromTo} from "../utils/GeoUtils";
import {createGeoDataHook} from "../service/GeolocationService";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "100%",
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

    const [state, {fetchGameState, unlockLocations, setPuzzelDialogIsOpenFor}] = useGlobalGameStore();
    const {gameState, puzzelDialogIsOpenFor} = state;
    const {selectedLocation, locations} = gameState;

    //fetch init data from the server.
    useEffect(() => {
        (async () => {
            await fetchGameState();
        })();
    }, []);

    // unlockLocations.
    useEffect(() => {
        unlockLocations(geoData.coord);
    }, [geoData, locations]);

    //TODO remove
    useEffect(() => {
        console.log(state);
    }, [state])

    //container related
    const mapHeight = windowHeightMinusAppBarState();

    //selected location
    const selectedLocationOffSet = selectedLocation === null ? spacing : 56;

    // Dialog
    const onClickFabAnswerQuestion = (e: OnClickEvent): void => {
        if (selectedLocation !== null) {
            setPuzzelDialogIsOpenFor(selectedLocation);
        }
    }

    //map related
    const [followUser, setFollowUser] = useState<boolean>(true);
    const onClickFabCenterBtn = (_: OnClickEvent): void => setFollowUser(true);


    // drawer
    const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
    const onClickMenuButton: OnClickCallback = (_: OnClickEvent): void => {
        setDrawerIsOpen(true);
    };


    return (
        <Fragment>
            <div className={classes.root}>
                <NavBar
                    geoData={geoData}
                    onMenuButtonClick={onClickMenuButton}
                />
                <SideBarDrawer
                    setPuzzelDialogIsOpenFor={setPuzzelDialogIsOpenFor}
                    userLocation={geoData.coord}
                    isOpen={drawerIsOpen}
                    setIsOpen={setDrawerIsOpen}
                />
                {state.gameState.locations.map(location => {
                    return (
                        <PuzzelDialog
                            key={location.name}
                            location={location}
                            isOpen={puzzelDialogIsOpenFor === location.name}
                        />
                    );
                })}

                <div
                    className={classes.mapContainer}
                    style={{height: mapHeight}}
                >
                    {selectedLocation && !selectedLocation?.isCompleted &&
                    <div>
                        <CompassPullOver
                            bearingComparedToCurrentLocation={bearingFromTo(geoData.coord, selectedLocation.coords)}
                        />
                        <LocationPullOver
                            userLocation={geoData.coord}
                            location={selectedLocation}
                        />
                    </div>
                    }
                    {selectedLocation &&
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
                        userLocation={geoData}
                        followUser={followUser}
                        setFollowUser={setFollowUser}
                    />
                </div>

            </div>

        </Fragment>
    );
}

export default IndexPage;