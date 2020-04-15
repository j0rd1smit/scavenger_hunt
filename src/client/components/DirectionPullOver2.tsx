import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

interface IDirectionPullOver2Props {

}

function DirectionPullOver2(props: IDirectionPullOver2Props): JSX.Element {
    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.root}>
            </div>
        </Fragment>
    );
}

export default DirectionPullOver2;
