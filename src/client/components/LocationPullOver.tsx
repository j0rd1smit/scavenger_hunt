import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    Grid,
    IconButton,
    Paper, Typography,
} from "@material-ui/core";
import {Close} from "@material-ui/icons";


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

}

function LocationPullOver(props: ILocationPullOverProps): JSX.Element {
    const classes = useStyles();
    return (
        <Fragment>
            <Grid
                className={classes.container}
                container
                justify={"center"}
                alignItems={"center"}
            >
                <Grid xl={6} lg={6} md={6} xs={12} sm={12} >
                    <Paper className={classes.paper}>

                        <Typography variant="h5" align={"justify"}>
                            Location A: 500m
                        </Typography>

                        <IconButton aria-label="Close">
                            <Close />
                        </IconButton>

                    </Paper>
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default LocationPullOver;
