import React, {Fragment, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText,
    TextField, Typography,

} from "@material-ui/core";
import {OnChangeEvent, OnClickCallback, OnClickEvent, SetState} from "../utils/ReactTypes";
import {CameraAlt} from "@material-ui/icons";
import QRCodeDailog from "./QRCodeDailog";



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        appBar: {
            position: "relative",
        },
        flex: {
            flex: 1,
        },
        cover: {
            width: "100%",
        },
        contentContainer: {
            width: "100%",
        },
        cammeraButton: {
            margin: theme.spacing(1),
        },
    }),
);

type QRCODE = "QRCode";
type OPENQUESTION = "Open";

interface IPuzzelDialogProps {
    isOpen: boolean;
    setIsOpen: SetState<boolean>;
    type: QRCODE|OPENQUESTION
}

function PuzzelDialog(props: IPuzzelDialogProps): JSX.Element {
    const classes = useStyles();
    const {type} = props;

    const [isSolved, setIsSolved] = useState<boolean>(false);


    const handleOnClose = (e: OnClickEvent): void => props.setIsOpen(false);


    const getContent = (): JSX.Element => {
        if (isSolved) {
            return (
                <AnswerContent
                    handleOnClose={handleOnClose}
                />
            );
        }

        if (type === "QRCode") {
            return (
                <QRCodeQuestionContent
                    setIsSolved={setIsSolved}
                    handleOnClose={handleOnClose}
                />
            );
        }
        return (
            <QuestionContent
                setIsSolved={setIsSolved}
                handleOnClose={handleOnClose}
            />
        );
    }

    return (
        <Fragment>
            <div className={classes.root}>
                <Dialog
                    open={props.isOpen}
                    onBackdropClick={handleOnClose}
                    scroll={"body"}
                    fullWidth
                >
                    {getContent()}
                </Dialog>
            </div>
        </Fragment>
    );
}

interface IQRCodeQuestionContentProps {
    handleOnClose: OnClickCallback;
    setIsSolved: SetState<boolean>;
}

function QRCodeQuestionContent(props: IQRCodeQuestionContentProps): JSX.Element {
    const classes = useStyles();
    const {handleOnClose} = props;

    const [QRCodeDialogIsOpen, setQRCodeDialogIsOpen] = useState<boolean>(false);

    const onClickScanBtn = (e: OnClickEvent): void => setQRCodeDialogIsOpen(true);

    return (
        <Fragment>
            <DialogTitle id="form-dialog-title">Location A</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Find the QR code. This is my view:
                </DialogContentText>
                <img
                    src={"/static/images/rebus10.jpg"}
                    className={classes.cover}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose} color="primary">
                    Cancel
                </Button>
                <Button
                    color="primary"
                    className={classes.cammeraButton}
                    endIcon={<CameraAlt/>}
                    onClick={onClickScanBtn}
                >
                    Scan
                </Button>
            </DialogActions>
            <QRCodeDailog isOpen={QRCodeDialogIsOpen} setIsOpen={setQRCodeDialogIsOpen}/>
        </Fragment>
    );
}

interface IQuestionContentProps {
    handleOnClose: OnClickCallback;
    setIsSolved: SetState<boolean>;
}

function QuestionContent(props: IQuestionContentProps): JSX.Element {
    const classes = useStyles();
    const {handleOnClose, setIsSolved} = props;

    const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
    const [userAnswer, setUserAnswer] = useState<string>("");
    const [answerHelperText, setAnswerHelperText] = useState<string>("");

    const onChangeAnswer = (e: OnChangeEvent): void => {
        setUserAnswer(e.target.value);
    }

    const onSubmit = (e: OnClickEvent): void => {
        if (userAnswer === "Ze blijft om de hete brij heendraaien") {
            setAnswerHelperText("");
            setIsIncorrect(false);
            setIsSolved(true);
        } else {
            setAnswerHelperText("Sorry but that is incorrect.");
            setIsIncorrect(true);
        }
    }

    return (
        <Fragment>
            <DialogTitle id="form-dialog-title">Location A</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Solve the rebus.
                </DialogContentText>
                <img
                    src={"/static/images/rebus10.jpg"}
                    className={classes.cover}
                />
                <FormControl fullWidth error={isIncorrect}>
                    <TextField
                        margin="dense"
                        id="yourAnswer"
                        label="Your answer"
                        type="text"
                        fullWidth
                        error={isIncorrect}
                        value={userAnswer}
                        onChange={onChangeAnswer}
                    />
                    <FormHelperText error={isIncorrect} id="yourAnswer-text">{answerHelperText}</FormHelperText>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Fragment>
    );
}

interface IAnswerContentProps {
    handleOnClose: OnClickCallback;
}

function AnswerContent(props: IAnswerContentProps): JSX.Element {
    const {handleOnClose} = props;

    return (
        <Fragment>
            <DialogTitle id="form-dialog-title">Location A</DialogTitle>
            <DialogContent>
                <Typography variant="body1" display="block" gutterBottom>
                    You solved it. Well done!
                </Typography>
                <Typography variant="body1" display="block" gutterBottom>
                    The code is:
                </Typography>
                <Typography align={"center"} variant="overline" display="block" gutterBottom>
                    999
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose} color="primary">
                    Close
                </Button>
            </DialogActions>

        </Fragment>
    );
}

export default PuzzelDialog;
