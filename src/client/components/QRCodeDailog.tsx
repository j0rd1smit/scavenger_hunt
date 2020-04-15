import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {OnClickEvent, SetState} from "../utils/ReactTypes";
import {AppBar, Dialog, Grid, IconButton, Toolbar, Typography} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {windowHeightMinusAppBarState} from "../utils/ReactHelpers";
import QrReader from 'react-qr-reader'


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            backgroundColor: "black",
        },
        appBar: {
            position: "relative",
        },
        flex: {
            flex: 1,
        },
        gridContainer: {
            backgroundColor: "black",
        }
    }),
);

interface IQRCodeDailogProps {
    isOpen: boolean;
    setIsOpen: SetState<boolean>;
}

function QRCodeDailog(props: IQRCodeDailogProps): JSX.Element {
    const classes = useStyles();
    const contentHeight = windowHeightMinusAppBarState();

    const handleOnClose = (e: OnClickEvent): void => props.setIsOpen(false);
    const handleScan = (data: string): void => {
        if (data) {
            alert(data);
            props.setIsOpen(false);
        }
    }
    const handleError = (err: Error) => {
        //TODO
        alert(err.message);
        props.setIsOpen(false);
    }

    const qrReader = (): JSX.Element => {
        if (window.innerWidth <= contentHeight) {
            return (
                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{
                        width: "100%",
                    }}
                />
            );
        }
        return (
            <div
                style={{
                    width: contentHeight,
                }}
            >
                <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{
                        height: "100%",
                    }}
                />
            </div>

        );
    }

    return (
        <Fragment>
            <Dialog
                fullScreen
                open={props.isOpen}
                className={classes.root}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            QR code scanner
                        </Typography>
                        <IconButton color="inherit" onClick={handleOnClose} aria-label="Close">
                            <CloseIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Grid
                    className={classes.gridContainer}
                    container
                    alignContent={"center"}
                    alignItems={"center"}
                    justify={"center"}
                    style={{height: contentHeight}}
                >
                    {qrReader()}
                </Grid>
            </Dialog>
        </Fragment>
    );
}

export default QRCodeDailog;
