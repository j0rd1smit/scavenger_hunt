import React, {Fragment, useEffect, useRef, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {AppBar, Icon, IconButton, Toolbar, Typography} from "@material-ui/core";
import {OnClickCallback} from "../utils/ReactTypes";
import InlineCompass from "./InlineCompass";
import {getOrDefault} from "../utils/utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        compassContainer: {
            width: "100%",
            flexGrow: 1,
        }
    }),
);

export interface INavBarProps {
    onMenuButtonClick: OnClickCallback;
    showCompass: boolean;
}

function NavBar(props: INavBarProps): JSX.Element {
    const classes = useStyles();
    const {showCompass} = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    useEffect(() => {
        const onResize = (_: Event) => setContainerWidth(getOrDefault(containerRef?.current?.getBoundingClientRect().width, 0));
        window.addEventListener("resize", onResize);
        return (): void => {
            window.removeEventListener("resize", onResize);
        }
    }, []);

    useEffect(() => {
        setContainerWidth(getOrDefault(containerRef?.current?.getBoundingClientRect().width, 0));
    });

    return (
        <Fragment>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        {!showCompass &&
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={props.onMenuButtonClick}
                        >
                            <Icon>menu</Icon>
                        </IconButton>
                        }

                        <div className={classes.compassContainer} ref={containerRef}>
                        {
                            showCompass ?
                                (

                                        <InlineCompass containerWidth={containerWidth}/>

                                )
                                :
                                <Fragment>

                                    <Typography variant="h6" className={classes.title}>
                                        Treasure Trails
                                    </Typography>
                                </Fragment>
                        }
                        </div>

                    </Toolbar>
                </AppBar>
            </div>
        </Fragment>
    );
}

export default NavBar;