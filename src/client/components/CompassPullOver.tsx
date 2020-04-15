import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Card, CardMedia, Typography} from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        container: {
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 401,

        },
        compassCard: {
            "border-radius": 25,
            position: "relative",
        },
        compassMediaContainer: {
            padding: 5,
            left: 5,
            position: "relative",
            width: 75,
            height: 50,
        },
        compassMedia: {
            width: 50,
            height: 50,
        },
    }),
);

interface IDirectionPullOver2Props {
    bearingComparedToCurrentLocation: number;
}

function CompassPullOver(props: IDirectionPullOver2Props): JSX.Element {
    const classes = useStyles();

    const bearing = props.bearingComparedToCurrentLocation;

    return (
        <Fragment>
            <div
                className={classes.container}>
                <Card className={classes.compassCard}>
                    <div className={classes.compassMediaContainer}>
                        <CardMedia
                            className={classes.compassMedia}
                            image="static/images/arrow.png"
                            title="Bearing towards goal"
                            style={{
                                transform: `rotate(${bearing}deg)`,
                            }}
                        />
                    </div>

                    <Typography align={"center"} variant="overline" component="p">
                        {Math.round(bearing)}°
                    </Typography>
                </Card>
            </div>
        </Fragment>
    );
}

export default CompassPullOver;
