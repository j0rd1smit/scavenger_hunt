import React, {Fragment, } from "react";
import {
    AppBar, Button,
    Card, CardActions,
    CardContent,
    Grid,
    Toolbar,
    Typography
} from "@material-ui/core";


import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {OnClickEvent} from "../utils/ReactTypes";
import {indexPageUrl} from "../routes/Hrefs";

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


interface INoMatch404PageProps {

}



function NoMatch404Page(props: INoMatch404PageProps): JSX.Element {
    const classes = useStyles();
    const history = useHistory();

    const onClickGoBack = (e: OnClickEvent): void => history.push(indexPageUrl);

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
                                    You seem lost. Maybe I can help?
                                </Typography>
                                <Typography gutterBottom variant="body1" component="h2">
                                    It seems like you wanted to go to a page that doesn't exist. Whenever you are ready click on the button below to go back to the home page.
                                </Typography>
                            </CardContent>

                            <CardActions>
                                <Button onClick={onClickGoBack} size="small" color="primary">
                                    Go back
                                </Button>
                            </CardActions>

                        </Card>
                    </Grid>

                </Grid>

            </div>
        </Fragment>
    );
}


export default NoMatch404Page;
