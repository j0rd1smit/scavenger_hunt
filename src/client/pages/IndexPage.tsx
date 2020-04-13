import React, {Fragment, useState} from "react";
import NavBar from "../components/NavBar";
import { Map, Marker, Popup, TileLayer } from "react-leaflet"
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {createGeoDataHook} from "../service/GeolocationService";
import QrReader from 'react-qr-reader'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            height: 500,
            width: 500,
        },
    }),
);

function IndexPage(): JSX.Element {
    const classes = useStyles();
    const geoData = createGeoDataHook();
    const [result, setResult] = useState<string>("");

    const handleError = (err: Error) => alert(err.message);
    const handleScan = (data: string) => {
        setResult(data);
    }

    // @ts-ignore
    return (
        <Fragment>
            <NavBar/>

            <div className={classes.root}>
                <Map center={geoData.coord} zoom={18}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Marker position={geoData.coord}>
                        <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
                    </Marker>
                </Map>
            </div>
            <div>
                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: '100%' }}
                />
                <p>result: {result}</p>
            </div>

        </Fragment>
    );
}

export default IndexPage;