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
import {ILocation} from "../utils/locations";
import {bearingFromTo, distanceInMetersBetween, LatLng} from "../utils/GeoUtils";


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
    userLocation: LatLng;
    locations: ILocation[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

function SideBarDrawer(props: IDrawerProps): JSX.Element {
    const classes = useStyles();
    const noLocationSelected = "None selected"

    const [showTrackableLocations, setShowTrackableLocations] = useState<boolean>(true);
    const [selectedLocation, setSelectedLocation] = useState<string>(noLocationSelected);


    const onClickTrackableLocationButton = (e: OnClickEvent) => setShowTrackableLocations(!showTrackableLocations);

    const onChangeRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                                <EditLocation/>
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
                                <LocationListItem
                                    name={noLocationSelected}
                                    isCompleted={false}
                                    isSelected={selectedLocation === noLocationSelected}
                                    onChangeRadioButton={onChangeRadioButton}
                                />
                                {props.locations.map((location: ILocation, idx: number) => {
                                    return (
                                        <LocationListItem
                                            key={idx}
                                            name={location.name}
                                            isCompleted={location.isCompleted}
                                            direction={bearingFromTo(props.userLocation, location.coords)}
                                            distance={distanceInMetersBetween(props.userLocation, location.coords)}
                                            isSelected={selectedLocation === location.name}
                                            onChangeRadioButton={onChangeRadioButton}
                                        />
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

interface ILocationListItem {
    name: string;
    distance?: number;
    direction?: number;
    isCompleted: boolean;
    isSelected: boolean;
    onChangeRadioButton: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function LocationListItem(props: ILocationListItem): JSX.Element {
    const classes = useStyles();
    const {name, isCompleted, distance, direction, onChangeRadioButton, isSelected} = props;
    return (
        <ListItem >
            <ListItemIcon>
                {isCompleted ?
                    <Radio
                        checked={true}
                        onChange={onChangeRadioButton}
                        value={name}
                        name="radio-button-demo"
                        inputProps={{'aria-label': name}}
                        checkedIcon={<CheckCircle/>}
                        disabled={true}
                    />
                    :
                    <Radio
                        checked={isSelected}
                        onChange={onChangeRadioButton}
                        value={name}
                        name="radio-button-demo"
                        inputProps={{'aria-label': name}}
                    />

                }
            </ListItemIcon>
            <ListItemText
                primary={<Button color="primary" onClick={(e: any) => console.log(name)}>{name}</Button>}
                secondary={(
                    distance !== undefined && direction !== undefined ?
                    <span>
                     <Room className={classes.directionIcon}
                                                              fontSize={"small"}/>{Math.round(distance)}m <Explore
                        className={classes.directionIcon} fontSize={"small"}/>{Math.round(direction)}°
                                                    </span>
                        :
                        <div/>
                )}

            />

        </ListItem>
    );

}

export default SideBarDrawer;
