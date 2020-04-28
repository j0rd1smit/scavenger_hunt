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
import {findLastUnlockedCode, ILocation, IQuestion} from "../../utils/Locations";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";


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


interface IPuzzelDialogProps {
    isOpen: boolean;
    location: ILocation;
}

function PuzzelDialog(props: IPuzzelDialogProps): JSX.Element {
    const classes = useStyles();
    const {location} = props;
    const [, {markLocationAsCompleted, closePuzzelDialog, clearSelectedLocation}] = useGlobalGameStore();

    const onSolved = (): void => {
        markLocationAsCompleted(location);
        clearSelectedLocation();
    }

    const handleOnClose = (e: OnClickEvent): void => closePuzzelDialog();


    const getContent = (): JSX.Element => {
        if (!location.isUnlocked) {
            return (
                <NotUnlockedContent
                    handleOnClose={handleOnClose}
                />
            )
        }
        if (location.isCompleted) {
            return (
                <AnswerContent
                    handleOnClose={handleOnClose}
                />
            );
        }

        if (location.question.type === "QR_CODE") {
            return (
                <QRCodeQuestionContent
                    question={location.question}
                    onSolved={onSolved}
                    handleOnClose={handleOnClose}
                />
            );
        }
        return (
            <QuestionContent
                question={location.question}
                onSolved={onSolved}
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
                    <DialogTitle id="form-dialog-title">{location.name}</DialogTitle>
                    {getContent()}
                </Dialog>
            </div>
        </Fragment>
    );
}

interface IQRCodeQuestionContentProps {
    question: IQuestion;
    handleOnClose: OnClickCallback;
    onSolved: () => void;
}

function QRCodeQuestionContent(props: IQRCodeQuestionContentProps): JSX.Element {
    const classes = useStyles();
    const {handleOnClose, question, onSolved} = props;

    const [QRCodeDialogIsOpen, setQRCodeDialogIsOpen] = useState<boolean>(false);

    const setAnswer: SetState<string> = (userAnswer: string) => {
        if (question.answer === userAnswer) {
            onSolved();
        } else {
            //TODO
            alert("That code is incorrect!")
        }
    }

    const onClickScanBtn = (e: OnClickEvent): void => setQRCodeDialogIsOpen(true);

    return (
        <Fragment>
            <DialogContent>
                <DialogContentText>
                    {question.description}
                </DialogContentText>
                {question.img !== undefined &&
                <img
                    src={question.img}
                    alt={question.img}
                    className={classes.cover}
                />
                }
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
            <QRCodeDailog setAnswer={setAnswer} isOpen={QRCodeDialogIsOpen} setIsOpen={setQRCodeDialogIsOpen}/>
        </Fragment>
    );
}

interface IQuestionContentProps {
    question: IQuestion;
    handleOnClose: OnClickCallback;
    onSolved: () => void;
}

function QuestionContent(props: IQuestionContentProps): JSX.Element {
    const classes = useStyles();
    const {handleOnClose, onSolved, question} = props;

    const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
    const [userAnswer, setUserAnswer] = useState<string>("");
    const [answerHelperText, setAnswerHelperText] = useState<string>("");

    const onChangeAnswer = (e: OnChangeEvent): void => {
        setUserAnswer(e.target.value);
    }

    const reg = new RegExp(question.answer, 'g');
    const onSubmit = (e: OnClickEvent): void => {
        //if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
        if (userAnswer.toLowerCase().match(reg)) {
            setAnswerHelperText("");
            setIsIncorrect(false);
            onSolved();
        } else {
            setAnswerHelperText("Sorry but that is incorrect.");
            setIsIncorrect(true);
        }
    }

    return (
        <Fragment>
            <DialogContent>
                <DialogContentText>
                    {question.description}
                </DialogContentText>
                {question.img !== undefined &&
                <img
                    src={question.img}
                    alt={question.img}
                    className={classes.cover}
                />
                }
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

    const [state, {}] = useGlobalGameStore();
    const {codes, locations} = state.gameState;

    const lastUnlockedCode = findLastUnlockedCode(codes, locations);

    return (
        <Fragment>
            <DialogContent>
                <Typography variant="body1" display="block" gutterBottom>
                    You solved it. Well done!
                    {lastUnlockedCode === undefined ?
                        " You have already unlocked all the codes, so I can't give you anymore."
                        :
                        ` You unlocked a piece of ${lastUnlockedCode.name}:`
                    }
                </Typography>
                {lastUnlockedCode !== undefined &&
                    <Fragment>
                        <Typography align={"center"} variant="button" display="block" gutterBottom>
                            {lastUnlockedCode.code}
                        </Typography>
                        <Typography variant="caption" display="block" gutterBottom>
                            If you need to see this code again, you can find it in the sidebar under "Unlocked codes".
                            We you are ready, please select your location in the sidebar.
                        </Typography>
                    </Fragment>
                }

            </DialogContent>
            <DialogActions>
                <Button onClick={handleOnClose} color="primary">
                    Close
                </Button>
            </DialogActions>

        </Fragment>
    );
}

interface INotUnlockedContentProps {
    handleOnClose: OnClickCallback;
}

function NotUnlockedContent(props: INotUnlockedContentProps): JSX.Element {
    const {handleOnClose} = props;

    return (
        <Fragment>
            <DialogContent>
                <Typography variant="body1" display="block" gutterBottom>
                    Sorry but you have not yet unlocked this question.
                    You can unlock it by physically visiting the location.
                    However, you have to find this location first using the map and compass.
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
