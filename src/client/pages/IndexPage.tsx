import React, {Fragment, useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import SideBarDrawer from "../components/SideBarDrawer";
import MainMapView from "../components/MainMapView";
import PuzzelDialog from "../components/PuzzelDialog";
import LocationPullOver from "../components/LocationPullOver";
import {Fab, Tooltip} from "@material-ui/core";
import {Navigation, RateReview} from "@material-ui/icons";
import {localStorageFlagHook, windowHeightMinusAppBarState} from "../utils/ReactHelpers";
import {createGeoDataHook} from "../service/GeolocationService";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";
import {permissionStatusHook} from "../utils/permissionsUtils";
import {Redirect} from "react-router-dom";
import {permissionsPageUrl} from "../routes/Hrefs";
import {isPresent} from "../utils/utils";
import ExplanationDialog from "../components/ExplanationDialog";

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

    // tutorial
    const [isExplanationDialogOpen, setIsExplanationDialogOpen] = localStorageFlagHook(true, "isExplanationDialogOpen");


    const permissionStatus = permissionStatusHook();

    if (permissionStatus === "Denied") {
        return (
            <Redirect
                to={{
                    pathname: permissionsPageUrl,
                }}
            />
        );
    }

    return (
        <Fragment>
            <div className={classes.root}>
                <NavBar
                    geoData={geoData}
                    onMenuButtonClick={onClickMenuButton}
                    sidebarIsOpen={drawerIsOpen || isExplanationDialogOpen}
                />
                <SideBarDrawer
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
                        <LocationPullOver
                            userLocation={geoData.coord}
                            location={selectedLocation}
                        />
                    </div>
                    }
                    {selectedLocation &&
                    <div
                        className={classes.fabAnswerQuestion}
                        style={{
                            bottom: selectedLocationOffSet + 4 * spacing  + fabSize,
                        }}>
                        <Tooltip
                            placement={"left"}
                            title="Answer the question"
                            aria-label="Center"
                            open={puzzelDialogIsOpenFor !== selectedLocation.name && selectedLocation.isUnlocked}
                            arrow>
                            <Fab
                                color="primary"
                                aria-label="center"
                                onClick={onClickFabAnswerQuestion}
                            >
                                <RateReview/>
                            </Fab>
                        </Tooltip>
                    </div>
                    }
                    <div
                        className={classes.fabCenter}
                        style={{
                            bottom: selectedLocationOffSet + 2 * spacing,
                        }}>
                        <Tooltip
                            placement={isPresent(selectedLocation) ? "left" : "top"}
                            title="Center"
                            aria-label="Center"
                            enterTouchDelay={10}
                            arrow>
                            <Fab

                                color="primary"
                                aria-label="center"
                                onClick={onClickFabCenterBtn}

                            >
                                <Navigation/>
                            </Fab>
                        </Tooltip>
                    </div>
                    <MainMapView
                        followUser={followUser}
                        setFollowUser={setFollowUser}
                    />
                    <ExplanationDialog isOpen={isExplanationDialogOpen} setIsOpen={setIsExplanationDialogOpen}/>
                </div>

            </div>

        </Fragment>
    );
}

export default IndexPage;