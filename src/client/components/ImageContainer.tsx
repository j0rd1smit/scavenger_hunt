import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

interface IImageContainerProps {

}

function ImageContainer(props: IImageContainerProps): JSX.Element {
    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.root}>
            </div>
        </Fragment>
    );
}

export default ImageContainer;
