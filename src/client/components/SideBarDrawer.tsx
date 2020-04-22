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
import {OnClickCallback, OnClickEvent, SetState} from "../utils/ReactTypes";
import {
    CheckCircle,
    EditLocation,
    ExpandLess,
    ExpandMore,
    Explore,
    Room,
    Settings,
    SportsEsports
} from "@material-ui/icons";
import {ILocation} from "../../utils/Locations";
import {bearingFromTo, distanceInMetersBetween, LatLng} from "../utils/GeoUtils";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        locationList: {
            "padding-right": 30,
            position: "relative",
        },
        directionIcon: {
            position: "relative",
            top: 4,
        },
        inline: {
            display: 'inline',
        },
    }),
);

interface IDrawerProps {
    userLocation: LatLng;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setPuzzelDialogIsOpenFor: SetState<ILocation|undefined>;
}

function SideBarDrawer(props: IDrawerProps): JSX.Element {
    const classes = useStyles();
    const noLocationSelected = "None selected"
    const [state, {setSelectedLocation, clearSelectedLocation}] = useGlobalGameStore();
    const locations = state.gameState.locations;
    const selectedLocation = state.gameState.selectedLocation;

    const [showTrackableLocations, setShowTrackableLocations] = useState<boolean>(true);
    const [showProgress, setShowProgress] = useState<boolean>(true);
    const [showSetting, setshowSetting] = useState<boolean>(false);

    const onClickProgressButton = (e: OnClickEvent) => setShowProgress(!showProgress);
    const onClickTrackableLocationButton = (e: OnClickEvent) => setShowTrackableLocations(!showTrackableLocations);
    const onClickShowSettingsButton = (e: OnClickEvent) => setshowSetting(!showSetting);


    const onChangeRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
        const location = locations.find((e: ILocation) => e.name === event.target.value);
        if (location) {
            setSelectedLocation(location);
        }
        else {
            clearSelectedLocation();
        }

        props.setIsOpen(false);
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
                    <List>
                        <ListItem button onClick={onClickShowSettingsButton}>
                            <ListItemIcon>
                                <Settings/>
                            </ListItemIcon>
                            <ListItemText primary="Setting"/>
                            {showSetting ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={showSetting}>
                            todo: hide completed locations, sort options, filter question types, notify if close to location your are not tracking.
                        </Collapse>

                        <ListItem button onClick={onClickProgressButton}>
                            <ListItemIcon>
                                <SportsEsports/>
                            </ListItemIcon>
                            <ListItemText primary="Progress"/>
                            {showProgress ? <ExpandLess/> : <ExpandMore/>}
                        </ListItem>
                        <Collapse in={showProgress}>
                            <List
                                component="div"
                                disablePadding
                                className={classes.locationList}
                            >
                                <ListItem dense alignItems="flex-start">
                                    <ListItemText
                                        primary="Compation rate"
                                        secondary={
                                            `${locations.filter(e => e.isCompleted).length} / ${locations.length}`
                                        }
                                    />
                                </ListItem>
                                <ListItem dense alignItems="flex-start">
                                    <ListItemText
                                        primary="Locations visted"
                                        secondary={
                                            `${locations.filter(e => e.isUnlocked).length} / ${locations.length}`
                                        }
                                    />
                                </ListItem>
                                <ListItem dense alignItems="flex-start">
                                    <ListItemText
                                        primary="QR-code questions completed"
                                        secondary={
                                            `${locations.filter(e => e.question.type == "QR_CODE" && e.isCompleted).length} / ${locations.filter(e => e.question.type == "QR_CODE").length}`
                                        }
                                    />
                                </ListItem>
                                <ListItem dense alignItems="flex-start">
                                    <ListItemText
                                        primary="Open questions completed"
                                        secondary={
                                            `${locations.filter(e => e.question.type === "OPEN" && e.isCompleted).length} / ${locations.filter(e => e.question.type == "OPEN").length}`
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Collapse>

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
                            >
                                <LocationListItem
                                    name={noLocationSelected}
                                    isCompleted={false}
                                    isSelected={selectedLocation === undefined || selectedLocation === null}
                                    onChangeRadioButton={onChangeRadioButton}
                                />
                                {locations.map((location: ILocation, idx: number) => {
                                    return (
                                        <LocationListItem
                                            key={idx}
                                            name={location.name}
                                            isCompleted={location.isCompleted}
                                            direction={bearingFromTo(props.userLocation, location.coords)}
                                            distance={distanceInMetersBetween(props.userLocation, location.coords)}
                                            isSelected={selectedLocation?.name === location.name}
                                            onChangeRadioButton={onChangeRadioButton}
                                            onClickBtn={_ => props.setPuzzelDialogIsOpenFor(location)}
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
    onClickBtn?: OnClickCallback;
}

function LocationListItem(props: ILocationListItem): JSX.Element {
    const classes = useStyles();
    const {name, isCompleted, distance, direction, onChangeRadioButton, isSelected, onClickBtn} = props;

    return (
        <ListItem>
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
                primary={<Button color="primary" disabled={onClickBtn === undefined} onClick={onClickBtn}>{name}</Button>}
                secondary={(
                    distance !== undefined && direction !== undefined && (
                        <span>
                     <Room className={classes.directionIcon}
                           fontSize={"small"}/>{Math.round(distance)}m <Explore
                            className={classes.directionIcon} fontSize={"small"}/>{Math.round(direction)}°
                                                    </span>)
                )}

            />
        </ListItem>
    );

}

export default SideBarDrawer;
