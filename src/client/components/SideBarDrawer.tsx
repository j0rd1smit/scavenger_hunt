import React, {Fragment} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {isIos} from "../utils/utils";
import {List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
    }),
);

interface IDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

function SideBarDrawer(props: IDrawerProps): JSX.Element {
    const classes = useStyles();
    return (
        <Fragment>
            <div className={classes.root}>
                <SwipeableDrawer
                    open={props.isOpen}
                    onClose={(e:  React.SyntheticEvent<{}, Event>):void => {
                        props.setIsOpen(false);
                    }}
                    onOpen={(e:  React.SyntheticEvent<{}, Event>):void => {
                        props.setIsOpen(true);
                    }}
                    disableBackdropTransition={!isIos()}
                    disableDiscovery={!isIos()}
                >
                    <List>
                        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                            <ListItem button key={text}>
                                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </SwipeableDrawer>
            </div>
        </Fragment>
    );
}

export default SideBarDrawer;
