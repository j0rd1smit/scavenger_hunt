import React, {Fragment, useState} from "react";
import NavBar from "../components/NavBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createGeoDataHook} from "../service/GeolocationService";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import {LatLngTuple} from "leaflet";
import SideBarDrawer from "../components/SideBarDrawer";
import MainMapView from "../components/MainMapView";
import PuzzelDialog from "../components/PuzzelDialog";
import Alert from '@material-ui/lab/Alert';
import {Grid} from "@material-ui/core";
import {AlertTitle} from "@material-ui/lab";


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
        }
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
                        <Grid item md={6} sm={12} xs={12}>
                            <Alert
                                icon={false}
                                severity="success"
                                onClose={() => {}}
                            >
                                <AlertTitle>Location A</AlertTitle>

                            </Alert>
                        </Grid>
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