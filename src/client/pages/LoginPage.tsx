import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

interface ILoginPageProps {

}

function LoginPage(props: ILoginPageProps): JSX.Element {
    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.root}>
                login page
            </div>
        </Fragment>
    );
}

export default LoginPage;
