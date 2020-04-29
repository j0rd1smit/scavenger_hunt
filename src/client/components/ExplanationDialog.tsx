import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import {SetState} from "../utils/ReactTypes";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";
import {compassIsSupportedHook} from "../service/HeadingService";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        cover: {
            width: "100%",
        },
    }),
);

interface IExplanationDialogProps {
    isOpen: boolean;
    setIsOpen: SetState<boolean>;
}

function ExplanationDialog(props: IExplanationDialogProps): JSX.Element {
    const {isOpen, setIsOpen} = props;

    const [state, {}] = useGlobalGameStore();
    const {locations} = state.gameState;
    const compassIsSupported = compassIsSupportedHook();


    const handleOnClose = (): void => setIsOpen(false);
    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.root}>
                <Dialog
                    open={isOpen}
                    onBackdropClick={handleOnClose}
                    scroll={"paper"}
                    fullWidth
                >
                    <DialogTitle id="form-dialog-title">Your mission</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            There are {locations.length} hidden locations.
                            It is your mission to find these hidden locations.
                            You can do this using the build-in compass and distance tracker.
                            These tools will appear on your screen once you have selected the location you want to find.
                            You can select this location in the sidebar.

                        </DialogContentText>
                        <img className={classes.cover} alt={"direction example"} src={compassIsSupported ? "/static/images/direction_android.png" : "/static/images/direction_ios.png"}/>

                        <DialogContentText>
                            This arrow indicates in which direction you have to walk to find the hidden location.
                            The arrow is based on GPS and updates as you move.
                            {compassIsSupported && " If you don't see the arrow rotate around your own axis. The compass is live. It changes depending on the direction in which you are looking."}
                            When you arrive at the search location, you will be presented with a puzzle.
                            Once you solve this puzzle you get a piece of the code.
                        </DialogContentText>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            onClick={handleOnClose}
                        >
                            Let's start
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Fragment>
    );
}

export default ExplanationDialog;
