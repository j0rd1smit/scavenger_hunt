import React, {Fragment, useState} from "react";
import NavBar from "../components/NavBar";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createGeoDataHook} from "../service/GeolocationService";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
import {LatLngTuple} from "leaflet";
import SideBarDrawer from "../components/SideBarDrawer";
import MainMapView from "../components/MainMapView";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        mapContainer: {
            height: "calc(100vh - 64px)",
            width: "100%",
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

                <div className={classes.mapContainer}>
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