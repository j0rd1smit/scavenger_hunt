import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Grid, IconButton, Paper, Typography,} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import {OnClickEvent} from "../utils/ReactTypes";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            position: "absolute",
            padding: 5,
            bottom: 0,
            zIndex: 401,
        },
        paper: {
            padding: 5,
            display: "flex",
            "justify-content": "space-between",
            alignItems: 'center',
        }
    }),
);

interface ILocationPullOverProps {
    name: string;
    distance: number;
    isInSearchArea: boolean;
    isCompleted: boolean;
    onClickClose: () => void;
}

function LocationPullOver(props: ILocationPullOverProps): JSX.Element {
    const classes = useStyles();
    const {name, distance, isInSearchArea, isCompleted} = props;

    const onClickCloseBtn = (e: OnClickEvent): void => props.onClickClose();
    const getText = (): string => {
        if (isCompleted) {
            return "Well done! Please select a new location.";
        }
        if (isInSearchArea) {
            return `You are in the search area!`;
        }
        return `${name}: ${Math.floor(distance)}m`;
    }

    return (
        <Fragment>
            <Grid
                className={classes.container}
                container
                justify={"center"}
                alignItems={"center"}
            >
                <Grid item xl={12} lg={12} md={12} xs={12} sm={12}>
                    <Paper className={classes.paper}>

                        <Typography variant="h5" align={"justify"}>
                            {getText()}
                        </Typography>

                        <IconButton
                            onClick={onClickCloseBtn}
                            aria-label="Close">
                            <Close/>
                        </IconButton>

                    </Paper>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default LocationPullOver;
