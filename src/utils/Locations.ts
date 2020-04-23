import {distanceInMetersBetween} from "../client/utils/GeoUtils";


export interface IGameState {
    locations: ILocation[];
    codes: ICode[];
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

export const QR_CODE_TYPE_STR = "QR_CODE";
export const OPEN_QUESTION_TYPE_STR = "OPEN";
export const questionTypes: ("QR_CODE"|"OPEN")[] = [QR_CODE_TYPE_STR, OPEN_QUESTION_TYPE_STR];


export interface IQuestion {
    type: "QR_CODE"|"OPEN";
    description: string;
    img?: string;
    answer: string;
}

export const isInTheSearchArea = (location: ILocation, userLocation: [number, number]): boolean => {
    return distanceInMetersBetween(location.coords, userLocation) <= location.unlockingDistanceInMeters;
}

export interface ICode {
    name: string;
    code: string;
}