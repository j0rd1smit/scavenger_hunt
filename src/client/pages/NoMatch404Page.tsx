import React, {Fragment, ReactNode} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

interface INoMatch404PageProps {

}

function NoMatch404Page(props: INoMatch404PageProps): JSX.Element {
    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.root}>
                TODO Page cannot be found.
                <Test>
                    <p>hello world</p>
                </Test>
            </div>
        </Fragment>
    );
}

interface ITestProps {
    children: ReactNode
}

function Test(props: ITestProps): JSX.Element {
    return (
        <Fragment>
            <div>
                {props.children}
            </div>
        </Fragment>
    );
}

export default NoMatch404Page;
