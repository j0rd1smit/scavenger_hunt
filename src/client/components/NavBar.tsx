import React, {Fragment, useEffect, useLayoutEffect, useRef, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {AppBar, Icon, IconButton, Toolbar, Typography} from "@material-ui/core";
import {OnClickCallback} from "../utils/ReactTypes";
import InlineCompass from "./InlineCompass";
import {getOrDefault} from "../utils/utils";
import {isHeadingSuported} from "../service/HeadingService";

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
        }
    }),
);

export interface INavBarProps {
    onMenuButtonClick: OnClickCallback;
    bearingComparedToCurrentLocation: number|undefined;
    onClickCloseCompass: OnClickCallback;
}

function NavBar(props: INavBarProps): JSX.Element {
    const classes = useStyles();
    const {bearingComparedToCurrentLocation, onClickCloseCompass} = props;
    const [compassIsSupported, setCompassIsSupported] = useState<boolean>(false);

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


    useEffect(() => {
        isHeadingSuported().then((isSupported: boolean) => setCompassIsSupported(isSupported));
    }, [])


    return (
        <Fragment>
            <div className={classes.root}>
                <AppBar position="static" ref={containerRef}>
                    <Toolbar>

                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={props.onMenuButtonClick}
                        >
                            <Icon>menu</Icon>
                        </IconButton>

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
                        {showCompass &&
                        <IconButton
                            edge="start"
                            className={classes.closeButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={onClickCloseCompass}
                        >
                            <Icon>close</Icon>
                        </IconButton>
                        }

                    </Toolbar>
                </AppBar>
            </div>
        </Fragment>
    );
}

export default NavBar;