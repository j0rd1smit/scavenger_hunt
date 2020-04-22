import React, {Fragment, useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {authenticate, isAuthenticated, logout} from "../utils/Auth";
import {indexPageUrl} from "../routes/Hrefs";
import {Redirect} from "react-router-dom";
import {
    AppBar,
    Button,
    Card,
    CardActions,
    CardContent, FormControl,
    FormHelperText,
    Grid,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";
import {OnChangeEvent, OnClickEvent} from "../utils/ReactTypes";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        title: {
            flexGrow: 1,
        },
        container: {
            padding: theme.spacing(1),
        },
        card: {
            width: "100%",
        }
    }),
);

interface ILoginPageProps {

}

function LoginPage(props: ILoginPageProps): JSX.Element {
    const classes = useStyles();

    const [succesfullyAuthenticated, setSuccesfullyAuthenticated] = useState<boolean>(false);



    const [errorMessage, setErrorMessage] = useState<string>("");
    const hasError = errorMessage.length > 0;

    useEffect(() => {
        if (isAuthenticated()) {
           logout();
        }
    }, [])


    const [username, setUsername] = useState<string>("");
    const onChangeUsername = (e: OnChangeEvent): void => {
        setUsername(e.target.value);
    }

    const [password, setPassword] = useState<string>("");
    const onChangePassword = (e: OnChangeEvent): void => {
        setPassword(e.target.value);
    }

    const onClickLogin = async (e: OnClickEvent): Promise<void> => {
        try {
            const result = await authenticate(username, password)
            setSuccesfullyAuthenticated(result.authenticated);
        } catch (e) {
            setErrorMessage("We can't sign you in with these credentials.");
        }
    }

    if (succesfullyAuthenticated) {
        return (
            <Redirect
                to={indexPageUrl}
            />
        )
    }

    return (
        <Fragment>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Treasure Trails
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Grid
                    className={classes.container}
                    container
                    alignContent={"center"}
                    alignItems={"center"}
                    justify={"center"}
                >
                    <Grid item xl={4} lg={4} md={4} xs={12} sm={12}>
                        <Card className={classes.card}>

                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Login
                                </Typography>
                                <FormControl fullWidth error={hasError}>
                                    <FormHelperText error={hasError} id="username-text">{errorMessage}</FormHelperText>
                                </FormControl>
                                <FormControl fullWidth error={hasError}>
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        id="username"
                                        label="Username"
                                        type="text"
                                        fullWidth
                                        error={hasError}
                                        value={username}
                                        onChange={onChangeUsername}
                                    />

                                    <TextField
                                        margin="dense"
                                        id="password"
                                        label="Password"
                                        type="password"
                                        fullWidth
                                        error={hasError}
                                        value={password}
                                        onChange={onChangePassword}
                                    />

                                </FormControl>
                            </CardContent>

                            <CardActions>
                                <Button onClick={onClickLogin} size="small" color="primary">
                                    Login
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                </Grid>

            </div>
        </Fragment>
    );
}

export default LoginPage;
