// Defining your own state and associated actions is required
import globalHook, {Store} from "use-global-hook";
import React from "react";
import {IGameState, ILocation} from "../../utils/Locations";
import axios from "axios";
import {fetchLocationsUrl} from "../routes/Hrefs";
import {getAuth} from "./Auth";
import {distanceInMetersBetween} from "./GeoUtils";


export type GlobalState = {
    gameState: IGameState;
    puzzelDialogIsOpenFor: string;
}

// Associated actions are what's expected to be returned from globalHook
export type GameStateActions = {
    fetchGameState: () => Promise<void>;
    saveGameState: () => Promise<void>;
    clearSelectedLocation: () => void;
    setSelectedLocation: (location: ILocation|undefined) => void;
    markLocationAsCompleted: (location: ILocation) => void;
    unlockLocations: (coords: [number, number]) => void;

    setPuzzelDialogIsOpenFor: (location: ILocation) => void;
    closePuzzelDialog: () => void;
};

type GameStateStore = Store<GlobalState, GameStateActions>;

const initialState: GlobalState = {
    gameState: {
        locations: [],
        selectedLocation: null,
        codes: [],
    },
    puzzelDialogIsOpenFor: "",
};

const fetchGameState = async (store: GameStateStore,): Promise<void> => {
    //TODO handle if saving fails
    const response = await axios.get(fetchLocationsUrl, {
        auth: getAuth(),
    });

    const gameState = await response.data;
    store.setState({...store.state, gameState});
}

const saveGameState = async (store: GameStateStore): Promise<void> => {
    //TODO handle if saving fails
    try {
        const data = {gameState: store.state.gameState};
        const options = {auth: getAuth(),}
        await axios.post(fetchLocationsUrl, data, options);
    } catch (e) {
        console.error(e);
    }
}

const setSelectedLocation = (store: GameStateStore, location: ILocation): void => {
    const gameState = {... store.state.gameState, selectedLocation: location}
    const updatedState = {... store.state, gameState: gameState};
    store.setState(updatedState);
}

const clearSelectedLocation = (store: GameStateStore): void => {
    const gameState = {... store.state.gameState, selectedLocation: null}
    const updatedState = {... store.state, gameState: gameState};
    store.setState(updatedState);
}

const unlockLocations = (store: GameStateStore, coords: [number, number]) => {
    // check if something can be unlocked.
    const shouldBeUnlocked = (location: ILocation) => !location.isUnlocked && distanceInMetersBetween(location.coords, coords) <= location.unlockingDistanceInMeters;
    const locationThatShouldBeUnlocked = store.state.gameState.locations.filter(shouldBeUnlocked);


    if (locationThatShouldBeUnlocked.length > 0) {
        // the mapping function for the change.
        const updateLocationMapping = (location: ILocation): ILocation => {
            if (shouldBeUnlocked(location)) {
                return {... location, isUnlocked: true};
            }
            return location;
        }

        // recreate game state based on changes
        const locations = store.state.gameState.locations.map(updateLocationMapping);
        const selectedLocation = store.state.gameState.selectedLocation === null ? null : updateLocationMapping(store.state.gameState.selectedLocation);
        const gameState = {... store.state.gameState, locations, selectedLocation}
        store.setState({... store.state, gameState});
        store.actions.saveGameState();
    }
}


const markLocationAsCompleted = (store: GameStateStore, location: ILocation): void => {
    //create the new location
    const updatedLocation = {... location, isCompleted: true};
    // update the selected location if needed.
    const selectedLocation = store.state.gameState.selectedLocation === location ? null : store.state.gameState.selectedLocation;

    // update the locations
    const mapLocationToUpdatedLocation = (l: ILocation) => {
        if (l === location) {
            return updatedLocation;
        }
        return l;
    }
    const locations = store.state.gameState.locations.map(mapLocationToUpdatedLocation);
    // recreate the state
    const gameState = {... store.state.gameState, locations, selectedLocation};
    const updatedState = {... store.state, gameState};

    store.setState(updatedState);
    store.actions.saveGameState();
}

const setPuzzelDialogIsOpenFor = (store: GameStateStore, location: ILocation): void => {
    store.setState({... store.state, puzzelDialogIsOpenFor: location.name});
}

const closePuzzelDialog = (store: GameStateStore): void => {
    store.setState({... store.state, puzzelDialogIsOpenFor: ""});
}


const actions = {
    fetchGameState,
    saveGameState,
    setSelectedLocation,
    markLocationAsCompleted,
    unlockLocations,
    clearSelectedLocation,

    setPuzzelDialogIsOpenFor,
    closePuzzelDialog,
};

export const useGlobalGameStore = globalHook<GlobalState, GameStateActions>(React, initialState, actions);