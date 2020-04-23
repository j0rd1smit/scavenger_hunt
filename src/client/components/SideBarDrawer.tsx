import React, {Fragment, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {isIos} from "../utils/utils";
import {
    Button,
    Checkbox,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, ListSubheader,
    Radio,
    SwipeableDrawer
} from "@material-ui/core";
import {OnClickCallback, OnClickEvent} from "../utils/ReactTypes";
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
        progressList: {
            "padding-right": 30,
            position: "relative",
            paddingLeft: theme.spacing(2),
        },
        settingsList: {
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
}

function SideBarDrawer(props: IDrawerProps): JSX.Element {
    const classes = useStyles();
    const {setIsOpen, userLocation} = props;


    const [orderingOption, setOrderingOption] = useState<string>("Distance");
    const orderingOptions = ["Name", "Distance"];
    const onChangeOrderingOption = (option: string) => {
        if (orderingOptions.includes(option)) {
            setOrderingOption(option);
        }
    }


    const distanceComparator = (one: ILocation, other: ILocation): number => distanceInMetersBetween(one.coords, userLocation) - distanceInMetersBetween(other.coords, userLocation);
    const nameComparator = (one: ILocation, other: ILocation): number => {
        if (one.name < other.name) {
            return -1;
        }
        if (one.name > other.name) {

        }
        return 0;
    }

    const locationComparators: {[key: string]: (one: ILocation, other: ILocation) => number;} = {
        "Name": nameComparator,
        "Distance": distanceComparator,
    }



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
                        <ProgressList/>
                        <SettingsList
                            orderingOption={orderingOption}
                            orderingOptions={orderingOptions}
                            onChangeOrderingOption={onChangeOrderingOption}
                        />
                        <LocationList
                            locationComparator={locationComparators[orderingOption]}
                            setIsOpen={setIsOpen}
                            userLocation={userLocation}
                        />
                    </List>
                </SwipeableDrawer>
            </div>
        </Fragment>
    );
}

interface ISettingsListProps {
    orderingOption: string;
    orderingOptions: string[];
    onChangeOrderingOption: (option: string) => void;
}

function SettingsList(props: ISettingsListProps): JSX.Element {
    const classes = useStyles();
    const {orderingOption, orderingOptions, onChangeOrderingOption} = props;

    const [showSetting, setshowSetting] = useState<boolean>(false);
    const onClickShowSettingsButton = (e: OnClickEvent) => setshowSetting(!showSetting);

    const filterOptions = ["Completed locations", "QR-code", "Open questions"];


    return (
        <Fragment>
            <ListItem button onClick={onClickShowSettingsButton}>
                <ListItemIcon>
                    <Settings/>
                </ListItemIcon>
                <ListItemText primary="Location settings"/>
                {showSetting ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={showSetting}>
                <List
                    component="div"
                    className={classes.settingsList}
                >
                    <ListSubheader>{"Location ordering"}</ListSubheader>
                    {orderingOptions.map(option => {
                        return (
                            <ListItem>
                                <ListItemIcon>
                                    <Radio
                                        checked={orderingOption === option}
                                        name="radio-button-demo"
                                        value={option}
                                        inputProps={{'aria-label': option}}
                                        onChange={e => onChangeOrderingOption(e.target.value)}
                                    />

                                </ListItemIcon>
                                <ListItemText
                                    primary={option}
                                />
                            </ListItem>
                        );
                    })}

                    <ListSubheader>{"Location filters"}</ListSubheader>
                    {filterOptions.map(option => {
                        return (
                            <ListItem>
                                <ListItemIcon>
                                    <Checkbox

                                        checked={true}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': option }}
                                    />

                                </ListItemIcon>
                                <ListItemText
                                    primary={option}
                                />
                            </ListItem>
                        );
                    })}

                </List>
            </Collapse>
        </Fragment>
    );
}

interface IProgressListProps {

}

function ProgressList(props: IProgressListProps): JSX.Element {
    const classes = useStyles();

    const [state, {}] = useGlobalGameStore();
    const locations = state.gameState.locations;

    const [showProgress, setShowProgress] = useState<boolean>(false);
    const onClickProgressButton = (e: OnClickEvent) => setShowProgress(!showProgress);


    return (
        <Fragment>
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
                    className={classes.progressList}
                >
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
                            primary="Locations visted"
                            secondary={
                                `${locations.filter(e => e.isCompleted).length} / ${locations.length}`
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
        </Fragment>
    )
}

interface ILocationListProps {
    setIsOpen: (isOpen: boolean) => void;
    userLocation: LatLng;
    locationComparator: (one: ILocation, other: ILocation) => number;
}

function LocationList(props: ILocationListProps): JSX.Element {
    const noLocationSelected = "None selected"
    const {userLocation, setIsOpen, locationComparator} = props;

    const [state, {setSelectedLocation, clearSelectedLocation, setPuzzelDialogIsOpenFor}] = useGlobalGameStore();
    const locations = state.gameState.locations.sort(locationComparator);
    const selectedLocation = state.gameState.selectedLocation;

    const [showTrackableLocations, setShowTrackableLocations] = useState<boolean>(true);

    const onClickTrackableLocationButton = (e: OnClickEvent) => setShowTrackableLocations(!showTrackableLocations);

    const onChangeRadioButton = (event: React.ChangeEvent<HTMLInputElement>) => {
        const location = locations.find((e: ILocation) => e.name === event.target.value);
        if (location) {
            setSelectedLocation(location);
        } else {
            clearSelectedLocation();
        }

        setIsOpen(false);
    };


    return (
        <Fragment>
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
                        isSelected={selectedLocation === undefined || selectedLocation === null || selectedLocation.isCompleted}
                        onChangeRadioButton={onChangeRadioButton}
                    />
                    {locations.map((location: ILocation, idx: number) => {
                        return (
                            <LocationListItem
                                key={idx}
                                name={location.name}
                                isCompleted={location.isCompleted}
                                direction={bearingFromTo(userLocation, location.coords)}
                                distance={distanceInMetersBetween(userLocation, location.coords)}
                                isSelected={selectedLocation?.name === location.name}
                                onChangeRadioButton={onChangeRadioButton}
                                onClickBtn={_ => setPuzzelDialogIsOpenFor(location)}
                            />
                        );
                    })}
                </List>
            </Collapse>
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
