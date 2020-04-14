import React, {Fragment, useEffect} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, IconButton, Typography} from "@material-ui/core";
import {OnClickEvent} from "../utils/ReactTypes";
import {Close, Explore, Room} from "@material-ui/icons";
import {useRefState} from "../utils/ReactHelpers";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        alertContainer: {
            position: "absolute",
            "padding-left": 50,
            "padding-right": 15,
            zIndex: 401,
        },
        closeBtn: {
            position: "absolute",
            right: 0,
            top: 0,
        },
        card: {
            display: 'flex',
            position: "relative",
            "padding-right": 15,
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            padding: 10,
            width: 151,
            height: 151,
        },
        playIcon: {
            height: 38,
            width: 38,
        },
        directionIcon: {
            position: "relative",
            top: 4,
        }
    }),
);

interface IDirectionPullOverProps {

}

function DirectionPullOver(props: IDirectionPullOverProps): JSX.Element {
    const classes = useStyles();

    const [bearing, bearingRef, setBearing] = useRefState<number>(0);

    useEffect(() => {
        setInterval(() => setBearing((bearingRef.current + 1) % 360), 50);
    }, [])

    return (
        <Fragment>
                <Grid
                    container
                    justify={"center"}
                    alignItems={"center"}
                    className={classes.alertContainer}>

                    <Card >
                        <div className={classes.card}>
                            <IconButton onClick={(e: OnClickEvent) => console.log(e)} className={classes.closeBtn} aria-label="close" size={"small"}>
                                <Close />
                            </IconButton>

                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography component="h5" variant="h5">
                                        Location A
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        <Room className={classes.directionIcon} fontSize={"small"}/> 100m
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        <Explore className={classes.directionIcon} fontSize={"small"}/> 360°
                                    </Typography>
                                </CardContent>
                            </div>
                            <CardMedia
                                className={classes.cover}
                                image="static/images/arrow.png"
                                title="Bearing towards goal"
                                style={{
                                    transform: `rotate(${bearing}deg)`,
                                }}
                            />
                        </div>
                        <CardActions>
                            <Button size="small" color="primary">
                                Center
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>

        </Fragment>
    );
}

export default DirectionPullOver;
