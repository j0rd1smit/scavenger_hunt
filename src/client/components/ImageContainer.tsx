import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {getOrDefault} from "../utils/utils";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            "align-items": "center",
            borderRadius: 5,
        },
        image: {
            height: "100%",
        },
    }),
);

interface IImageContainerProps {
    src: string;
    height?: number|string;
    style?: object;
}

function ImageContainer(props: IImageContainerProps): JSX.Element {
    const classes = useStyles();
    const height = getOrDefault(props.height, "100%");
    const style = {...props.style, height}

    return (
        <Fragment>
            <div className={classes.root} style={style} >
                <img className={classes.image} src={props.src}/>
            </div>
        </Fragment>
    );
}

export default ImageContainer;
