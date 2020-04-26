import React, {Fragment, useEffect, useLayoutEffect, useRef, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {AppBar, Icon, IconButton, Toolbar, Tooltip, Typography} from "@material-ui/core";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import InlineCompass from "./InlineCompass";
import {getOrDefault, isPresent} from "../utils/utils";
import {compassIsSupportedHook} from "../service/HeadingService";
import { useHistory } from "react-router-dom";
import {loginPageUrl} from "../routes/Hrefs";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";
import {bearingFromTo} from "../utils/GeoUtils";
import GeoData from "../service/GeoData";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        closeButton: {
            marginLeft: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        compassContainer: {
            flexGrow: 1,
        },
        pickNewLocationTooltip: {
            zIndex: 1119,
        }
    }),
);

export interface INavBarProps {
    onMenuButtonClick: OnClickCallback;
    geoData: GeoData;
    sidebarIsOpen: boolean;
}

function NavBar(props: INavBarProps): JSX.Element {
    const classes = useStyles();
    const {sidebarIsOpen} = props;

    const [state, {clearSelectedLocation}] = useGlobalGameStore();
    const {selectedLocation, locations} = state.gameState;

    const showChooseNextLocationTooltip = !sidebarIsOpen && !isPresent(selectedLocation) && locations.filter(e => !e.isCompleted && !e.isUnlocked).length > 0;

    const bearingComparedToCurrentLocation = selectedLocation !== null ? bearingFromTo(props.geoData.coord, selectedLocation.coords) : undefined;

    const compassIsSupported = compassIsSupportedHook();
    const showCompass = compassIsSupported && bearingComparedToCurrentLocation !== undefined;


    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);

    useLayoutEffect(() => {
        setContainerWidth(getOrDefault(containerRef?.current?.getBoundingClientRect().width, 0) - 48 - 48 - 16 - 16 - 12 - 12);
    }, [containerRef, showCompass]);

    useEffect(() => {
        const onResize = (_: Event) => setContainerWidth(getOrDefault(containerRef?.current?.getBoundingClientRect().width, 0) - 48 - 48 - 16 -16 - 12 - 12);
        window.addEventListener("resize", onResize);
        return (): void => {
            window.removeEventListener("resize", onResize);
        }
    }, []);


    const onClickCloseCompass = (e: OnClickEvent): void => clearSelectedLocation();

    const history = useHistory();
    const onClickLogout = (_: OnClickEvent): void => {
        history.push(loginPageUrl);
    }

    return (
        <Fragment>
            <div className={classes.root}>
                <AppBar position="static" ref={containerRef}>
                    <Toolbar>
                        <Tooltip
                            className={classes.pickNewLocationTooltip}
                            title="Pick a new location"
                            aria-label="Pick a new location"
                            open={showChooseNextLocationTooltip}
                            arrow>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="menu"
                                onClick={props.onMenuButtonClick}
                            >
                                <Icon>menu</Icon>
                            </IconButton>
                        </Tooltip>

                        {
                            showCompass && bearingComparedToCurrentLocation !== undefined ?
                                (
                                    <div className={classes.compassContainer}>
                                        <InlineCompass
                                            containerWidth={containerWidth}
                                            bearingComparedToCurrentLocation={bearingComparedToCurrentLocation}
                                        />
                                    </div>
                                )
                                :
                                <Fragment>

                                    <Typography variant="h6" className={classes.title}>
                                        Treasure Trails
                                    </Typography>
                                </Fragment>
                        }
                        {showCompass ?
                        <IconButton
                            edge="start"
                            className={classes.closeButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={onClickCloseCompass}
                        >
                            <Icon>close</Icon>
                        </IconButton>
                            :
                            <IconButton
                                edge="start"
                                className={classes.closeButton}
                                color="inherit"
                                aria-label="menu"
                                onClick={onClickLogout}
                            >
                                <Icon>logout</Icon>
                            </IconButton>
                        }

                    </Toolbar>
                </AppBar>
            </div>
        </Fragment>
    );
}

export default NavBar;