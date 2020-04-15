import React, {Fragment, useEffect, useState} from "react";
import NavBar from "../components/NavBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createGeoDataHook} from "../service/GeolocationService";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import {LatLngTuple} from "leaflet";
import SideBarDrawer from "../components/SideBarDrawer";
import MainMapView from "../components/MainMapView";
import PuzzelDialog from "../components/PuzzelDialog";
import CompassPullOver from "../components/CompassPullOver";
import LocationPullOver from "../components/LocationPullOver";
import {Fab} from "@material-ui/core";
import {CameraAlt, Navigation} from "@material-ui/icons";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        mapContainer: {
            position: "relative",
            //height: "calc(100vh - 64px)",
            width: "100%",
        },
        fabCenter: {
            zIndex: 402,
            position: 'absolute',
            bottom: 58 + theme.spacing(2),
            right: theme.spacing(2),
        },
        fabCamera: {
            zIndex: 402,
            position: 'absolute',
            bottom: 56 + 58 + theme.spacing(2) + theme.spacing(1),
            right: theme.spacing(2),
        },
    }),
);

interface IIndexPageProps {

}

function IndexPage(props: IIndexPageProps): JSX.Element {
    const classes = useStyles();
    const geoData = createGeoDataHook();

    const [mapHeight, setMapHeight] = useState<number>(window.innerHeight - 64);
    useEffect((): () => void => {
        const handleResize = (): void => setMapHeight(window.innerHeight - 64);
        window.addEventListener("resize", handleResize);

        return (): void => {
            window.removeEventListener('resize', handleResize);
        }
    })


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

                <div
                    className={classes.mapContainer}
                    style={{height: mapHeight}}
                >
                    <CompassPullOver/>
                    <LocationPullOver/>
                    <Fab
                        className={classes.fabCenter}
                        color="primary"
                        aria-label="center">
                        <Navigation/>
                    </Fab>
                    <Fab
                        className={classes.fabCamera}
                        color="primary"
                        aria-label="Scan QR code">
                        <CameraAlt/>
                    </Fab>
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