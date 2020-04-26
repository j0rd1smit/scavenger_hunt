import React, {Fragment, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {isIos} from "../utils/utils";
import {
    Checkbox,
    Collapse,
    List,
    ListItem, ListItemAvatar,
    ListItemIcon,
    ListItemText, ListSubheader,
    Radio,
    SwipeableDrawer
} from "@material-ui/core";
import {OnClickEvent} from "../utils/ReactTypes";
import {
    CheckCircle,
    EditLocation,
    ExpandLess,
    ExpandMore,
    Explore, FilterCenterFocus, LockOpen,
    Room,
    Sort,
    SportsEsports, VpnKey
} from "@material-ui/icons";
import {
    ILocation,
    IQuestion,
    mapCodesToMaskedFormat,
    OPEN_QUESTION_TYPE_STR,
    QR_CODE_TYPE_STR
} from "../../utils/Locations";
import {bearingFromTo, distanceInMetersBetween, LatLng} from "../utils/GeoUtils";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";
import {StringMap} from "../../utils/Types";


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
        locationLabel: {
            cursor: "pointer",
        }
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

    //filtering logic
    const completed = "Completed locations";
    const QRCode = "QR-code";
    const OpenQuestion = "Open questions";
    const filteringOptions = [completed, QRCode, OpenQuestion];
    const filteringOptionsDefaults: StringMap<boolean> = {};
    filteringOptionsDefaults[completed] = false;
    filteringOptionsDefaults[QRCode] = true;
    filteringOptionsDefaults[OpenQuestion] = true;

    const [seletedFilteringOption, setSelectedFilteringOption] = useState<StringMap<boolean>>(filteringOptionsDefaults);

    const toggleFilteringOption = (option: string) : void => {
        const idx = filteringOptions.indexOf(option);
        if (idx !== -1) {
            const updatedSeletedFilteringOption = {
                ...seletedFilteringOption,
            }
            updatedSeletedFilteringOption[option] = !seletedFilteringOption[option];
            setSelectedFilteringOption(updatedSeletedFilteringOption);
        }
    }
    const locationFilter = (location: ILocation): boolean => {
        let res = true;
        if (!seletedFilteringOption[completed]) {
            res = res && !location.isCompleted;
        }

        if (!seletedFilteringOption[QRCode]) {
            res = res && location.question.type !== QR_CODE_TYPE_STR;
        }

        if (!seletedFilteringOption[OpenQuestion]) {
            res = res && location.question.type !== OPEN_QUESTION_TYPE_STR;
        }

        return res;
    }


    // ordering logic.
    const orderingOptions = ["Name", "Distance"];
    const [orderingOption, setOrderingOption] = useState<string>(orderingOptions[1]);
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
                        <CodesList/>
                        <SettingsList
                            orderingOption={orderingOption}
                            orderingOptions={orderingOptions}
                            onChangeOrderingOption={onChangeOrderingOption}

                            filteringOptions={filteringOptions}
                            seletedFilteringOption={seletedFilteringOption}
                            toggleFilteringOption={toggleFilteringOption}
                        />
                        <LocationList
                            locationFilter={locationFilter}
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
    //ordering
    orderingOption: string;
    orderingOptions: string[];
    onChangeOrderingOption: (option: string) => void;

    //filtering
    filteringOptions: string[];
    seletedFilteringOption: StringMap<boolean>;
    toggleFilteringOption: (option: string) => void;
}

function SettingsList(props: ISettingsListProps): JSX.Element {
    const classes = useStyles();
    const {
        orderingOption,
        orderingOptions,
        onChangeOrderingOption,

        filteringOptions,
        seletedFilteringOption,
        toggleFilteringOption,
    } = props;

    const [showSetting, setshowSetting] = useState<boolean>(false);
    const onClickShowSettingsButton = (e: OnClickEvent) => setshowSetting(!showSetting);




    return (
        <Fragment>
            <ListItem button onClick={onClickShowSettingsButton}>
                <ListItemIcon>
                    <Sort/>
                </ListItemIcon>
                <ListItemText primary="Location sorting"/>
                {showSetting ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={showSetting}>
                <List
                    component="div"
                    className={classes.settingsList}
                >
                    <ListSubheader disableSticky>{"Location ordering"}</ListSubheader>
                    {orderingOptions.map(option => {
                        return (
                            <ListItem key={option}>
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

                    <ListSubheader disableSticky>{"Location filters"}</ListSubheader>
                    {filteringOptions.map(option => {
                        return (
                            <ListItem key={option}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={seletedFilteringOption[option]}
                                        onChange={e => toggleFilteringOption(option)}
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

interface ICodesListProps {

}

function CodesList(props: ICodesListProps): JSX.Element {
    const classes = useStyles();

    const [state, {}] = useGlobalGameStore();
    const {codes, locations} = state.gameState;
    const nCompletedLocation = locations.filter(e => e.isCompleted).length;

    const [show, setShow] = useState<boolean>(false);
    const onClickShowButton = (e: OnClickEvent) => setShow(!show);



    return (
        <Fragment>
            <ListItem button onClick={onClickShowButton}>
                <ListItemIcon>
                    <LockOpen/>
                </ListItemIcon>
                <ListItemText primary="Unlocked codes"/>
                {show ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={show}>
                <List
                    component="div"
                    disablePadding
                    className={classes.progressList}
                >
                    {mapCodesToMaskedFormat(codes, nCompletedLocation).map((code, i) =>
                    <ListItem key={i}>
                        <ListItemAvatar>
                            <ListItemIcon>
                                <VpnKey />
                            </ListItemIcon>
                        </ListItemAvatar>
                        <ListItemText
                            primary={code.name}
                            secondary={code.code}
                        />
                    </ListItem>
                    )}
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
                    <ListSubheader disableSticky>{"Exploration"}</ListSubheader>
                    <ListItem dense alignItems="flex-start">
                        <ListItemText
                            primary="Visted"
                            secondary={
                                `${locations.filter(e => e.isUnlocked).length} / ${locations.length}`
                            }
                        />
                    </ListItem>

                    <ListItem dense alignItems="flex-start">
                        <ListItemText
                            primary="Completed"
                            secondary={
                                `${locations.filter(e => e.isCompleted).length} / ${locations.length}`
                            }
                        />
                    </ListItem>

                    <ListSubheader disableSticky>{"Puzzles"}</ListSubheader>
                    <ListItem dense alignItems="flex-start">
                        <ListItemText
                            primary="QR-code"
                            secondary={
                                `${locations.filter(e => e.question.type == "QR_CODE" && e.isCompleted).length} / ${locations.filter(e => e.question.type == "QR_CODE").length}`
                            }
                        />
                    </ListItem>

                    <ListItem dense alignItems="flex-start">
                        <ListItemText
                            primary="Open questions"
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
    locationFilter: (e: ILocation) => boolean;
}

function LocationList(props: ILocationListProps): JSX.Element {
    const noLocationSelected = "None selected"
    const {userLocation, setIsOpen, locationComparator, locationFilter} = props;

    const [state, {setSelectedLocation, clearSelectedLocation}] = useGlobalGameStore();
    const locations = state.gameState.locations.filter(locationFilter).sort(locationComparator);
    const selectedLocation = state.gameState.selectedLocation;

    const [showTrackableLocations, setShowTrackableLocations] = useState<boolean>(true);

    const onClickTrackableLocationButton = (e: OnClickEvent) => setShowTrackableLocations(!showTrackableLocations);

    const changeLocationTo = (value: string): void => {
        const location = locations.find((e: ILocation) => e.name === value);
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
                        changeLocationTo={changeLocationTo}
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
                                question={location.question}
                                changeLocationTo={changeLocationTo}
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
    question?: IQuestion;
    changeLocationTo: (name: string) => void;
}

function LocationListItem(props: ILocationListItem): JSX.Element {
    const classes = useStyles();
    const {name, isCompleted, distance, direction, changeLocationTo, isSelected, question} = props;

    const onChangeRadioButton = (e: React.ChangeEvent<HTMLInputElement>) => changeLocationTo(name);
    const onClickLabel = (e: OnClickEvent) => changeLocationTo(name);
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
                className={classes.locationLabel}
                onClick={onClickLabel}
                primary={name}
                secondary={(
                    distance !== undefined && direction !== undefined && (
                        <span>
                     <Room className={classes.directionIcon}
                           fontSize={"small"}/>{Math.round(distance)}m <Explore
                            className={classes.directionIcon} fontSize={"small"}/>{Math.round(direction)}°
                            {question?.type === "QR_CODE" && <FilterCenterFocus className={classes.directionIcon}/>}</span>)
                )}

            />
        </ListItem>
    );

}

export default SideBarDrawer;
