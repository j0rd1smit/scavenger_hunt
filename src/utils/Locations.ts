import {distanceInMetersBetween} from "../client/utils/GeoUtils";

export const emptyGameState  = (): IGameState => {
    return {
        locations: [],
        selectedLocation: null,
    }
}

export interface IGameState {
    locations: ILocation[];
    selectedLocation: ILocation|null;
}

export interface ILocation {
    name: string;
    unlockingDistanceInMeters: number;
    coords: [number, number];
    isUnlocked: boolean;
    isCompleted: boolean;
    code: string;
    question: IQuestion;
}

export const questionTypes: ("QR_CODE"|"OPEN")[] = ["QR_CODE", "OPEN"];

export interface IQuestion {
    type: "QR_CODE"|"OPEN";
    description: string;
    img?: string;
    answer: string;
}

export const isInTheSearchArea = (location: ILocation, userLocation: [number, number]): boolean => {
    return distanceInMetersBetween(location.coords, userLocation) <= location.unlockingDistanceInMeters;
}