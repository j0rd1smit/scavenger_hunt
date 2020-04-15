import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {AppBar, Icon, IconButton, Toolbar, Typography} from "@material-ui/core";
import {OnClickCallback} from "../utils/ReactTypes";

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
    }),
);

export interface INavBarProps {
    onMenuButtonClick: OnClickCallback;
}

function NavBar(props: INavBarProps): JSX.Element {
    const classes = useStyles();

    return (
        <Fragment>
            <div className={classes.root}>
                <AppBar position="static">
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
                        <Typography variant="h6" className={classes.title}>
                            Treasure Trails
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        </Fragment>
    );
}

export default NavBar;