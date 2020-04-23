import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    AppBar,
    Card,
    CardContent,
    Grid, List, ListItem, ListItemIcon, ListItemText,
    Toolbar,
    Typography
} from "@material-ui/core";
import {permissionStatusHook} from "../utils/permissionsUtils";
import {Explore, LocationOn} from "@material-ui/icons";
import {Redirect} from "react-router-dom";
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

interface IPremissionPageProps {

}

function PremissionPage(props: IPremissionPageProps): JSX.Element {
    const classes = useStyles();

    const permissionStatus = permissionStatusHook();

    if (permissionStatus === "Granted") {
        return (
            <Redirect
                to={{
                    pathname: indexPageUrl,
                }}
            />
        );
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
                                    Permissions: {permissionStatus}
                                </Typography>
                                <Typography gutterBottom variant="body1" component="h2">
                                    We need the some permissions before you can use this application. You will be redirected after you have granted us these permissions.
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <LocationOn />
                                        </ListItemIcon>
                                        <ListItemText primary="Your phone's GPS location." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Explore />
                                        </ListItemIcon>
                                        <ListItemText primary="Your phones compass location." />
                                    </ListItem>
                                </List>

                                {permissionStatus === "Asking" &&
                                <Typography gutterBottom variant="body1" component="h2">
                                    We have send you the permissions request. Please find the pop-up and click on accept.
                                </Typography>
                                }


                                {permissionStatus === "Denied" &&
                                    <Typography gutterBottom variant="body1" component="h2">
                                        You have denied the requested permissions.
                                        This means you won't be able to use this application.
                                        If you had a change of heart, you can always grant us these permissions by going to the privacy settings page of your browser.
                                        In some browsers you can also change it by clicking on the icon next to the url.
                                    </Typography>
                                }

                            </CardContent>

                        </Card>
                    </Grid>

                </Grid>

            </div>
        </Fragment>
    );
}

export default PremissionPage;
