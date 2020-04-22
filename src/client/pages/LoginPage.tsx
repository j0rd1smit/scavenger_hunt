import React, {Fragment, useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {authenticate, isAuthenticated} from "../utils/Auth";
import {indexPageUrl} from "../routes/Hrefs";
import {Redirect} from "react-router-dom";


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

    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        authenticate("jordi", "78965412").then(e => setMessage(JSON.stringify(e)));
    }, [])

    if (isAuthenticated()) {
        return <Redirect
            to={{
                pathname: indexPageUrl,
            }}
        />
    }

    return (
        <Fragment>
            <div className={classes.root}>
                login page
                <p>{message}</p>
            </div>
        </Fragment>
    );
}

export default LoginPage;
