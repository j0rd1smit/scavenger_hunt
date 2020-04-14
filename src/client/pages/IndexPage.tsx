import React, {Fragment, useState} from "react";
import NavBar from "../components/NavBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createGeoDataHook} from "../service/GeolocationService";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import {LatLngTuple} from "leaflet";
import SideBarDrawer from "../components/SideBarDrawer";
import MainMapView from "../components/MainMapView";
import PuzzelDialog from "../components/PuzzelDialog";
import {Card, CardContent, CardMedia, Grid, IconButton, Typography} from "@material-ui/core";
import {Close, Explore, Room,} from "@material-ui/icons";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        mapContainer: {
            position: "relative",
            height: "calc(100vh - 64px)",
            width: "100%",
        },
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
            width: 151,
            height: 151,
        },
        playIcon: {
            height: 38,
            width: 38,
        },
    }),
);

interface IIndexPageProps {

}

function IndexPage(props: IIndexPageProps): JSX.Element {
    const classes = useStyles();
    const geoData = createGeoDataHook();
    const [mapCenter, setMapCenter] = useState<LatLngTuple>([0., 0.]);

    const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false);
    const [puzzelDialogIsOpen, setPuzzelDialogIsOpen] = useState<boolean>(false);

    const onClickMenuButton: OnClickCallback = (e: OnClickEvent): void => {
        setDrawerIsOpen(true);
    };


    return (
        <Fragment>
            <div className={classes.root}>
                <NavBar
                    onMenuButtonClick={onClickMenuButton}
                />
                <SideBarDrawer
                    isOpen={drawerIsOpen}
                    setIsOpen={setDrawerIsOpen}
                />
                <PuzzelDialog
                    isOpen={puzzelDialogIsOpen}
                    setIsOpen={setPuzzelDialogIsOpen}
                />

                <div className={classes.mapContainer}>
                    <Grid
                        container
                        justify={"center"}
                        alignItems={"center"}
                        className={classes.alertContainer}>

                            <Card className={classes.card}>
                                <IconButton onClick={(e: OnClickEvent) => console.log(e)} className={classes.closeBtn} aria-label="close" size={"small"}>
                                    <Close />
                                </IconButton>

                                <div className={classes.details}>
                                    <CardContent className={classes.content}>
                                        <Typography component="h5" variant="h5">
                                            Location A
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            <Room fontSize={"small"}/>100m
                                        </Typography>
                                        <Typography variant="subtitle1" color="textSecondary">
                                            <Explore fontSize={"small"}/>360°
                                        </Typography>
                                    </CardContent>
                                </div>
                                <CardMedia
                                    className={classes.cover}
                                    image="static/images/arrow.png"
                                    title="Live from space album cover"
                                    style={{
                                        transform: "rotate(45deg)",
                                    }}
                                />
                            </Card>
                    </Grid>
                    <MainMapView
                        userLocation={geoData.coord}
                        mapCenter={mapCenter}
                        setMapCenter={setMapCenter}
                    />
                </div>

            </div>

        </Fragment>
    );
}

export default IndexPage;