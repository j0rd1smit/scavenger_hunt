import React, {Fragment, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {isIos} from "../utils/utils";
import {
    Button,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Radio,
    SwipeableDrawer
} from "@material-ui/core";
import {OnClickEvent} from "../utils/ReactTypes";
import {CheckCircle, EditLocation, ExpandLess, ExpandMore, Explore, Room} from "@material-ui/icons";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        locationList:{
            "padding-right": 30,
        },

        directionIcon: {
            position: "relative",
            top: 4,
        }
    }),
);

interface IDrawerProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

function SideBarDrawer(props: IDrawerProps): JSX.Element {
    const classes = useStyles();

    const locations = ["Location A", "Location B", "Location C", "Location D", "Location E"];
    const completedLocations = ["Location D", "Location E"];


    const [showTrackableLocations, setShowTrackableLocations] = useState<boolean>(true);
    const [selectedLocation, setSelectedLocation] = useState<string>(locations[0]);


    const onClickTrackableLocationButton = (e: OnClickEvent) => setShowTrackableLocations(!showTrackableLocations);

    const onChangeRadioButtone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedLocation(event.target.value);
    };

    return (
        <Fragment>
            <div className={classes.root}>
                <SwipeableDrawer
                    open={props.isOpen}
                    onClose={(e: React.SyntheticEvent<{}, Event>): void => {
                        props.setIsOpen(false);
                    }}
                    onOpen={(e: React.SyntheticEvent<{}, Event>): void => {
                        props.setIsOpen(true);
                    }}
                    disableBackdropTransition={!isIos()}
                    disableDiscovery={!isIos()}
                >
                    <List >
                        <ListItem button onClick={onClickTrackableLocationButton}>
                            <ListItemIcon>
                                <EditLocation
                                />
                            </ListItemIcon>
                            <ListItemText primary="Locations"/>
                            {showTrackableLocations ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={showTrackableLocations}>
                            <List
                                component="div"
                                disablePadding
                                className={classes.locationList}
                            >
                                {locations.map((name: string, idx: number) => {
                                    const labelId = `checkbox-list-secondary-label-${idx}`;
                                    return (
                                        <ListItem key={idx}>
                                            <ListItemIcon>
                                                {completedLocations.includes(name) ?
                                                    <Radio
                                                        checked={true}
                                                        onChange={onChangeRadioButtone}
                                                        value={name}
                                                        name="radio-button-demo"
                                                        inputProps={{'aria-label': name}}
                                                        checkedIcon={<CheckCircle/>}
                                                        disabled={true}
                                                    />
                                                :
                                                    <Radio
                                                        checked={selectedLocation === name}
                                                        onChange={onChangeRadioButtone}
                                                        value={name}
                                                        name="radio-button-demo"
                                                        inputProps={{'aria-label': name}}
                                                    />

                                                }
                                            </ListItemIcon>
                                            <ListItemText
                                                id={labelId}
                                                primary={<Button color="primary" onClick={(e: any) => console.log(name)}>{name}</Button>}
                                                secondary={(
                                                    <span>
                                                        <Room className={classes.directionIcon}
                                                              fontSize={"small"}/>100m <Explore
                                                        className={classes.directionIcon} fontSize={"small"}/>360°
                                                    </span>
                                                )}

                                            />

                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Collapse>
                    </List>
                </SwipeableDrawer>
            </div>
        </Fragment>
    );
}

export default SideBarDrawer;
