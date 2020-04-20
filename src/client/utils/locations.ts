import {LatLng} from "./GeoUtils";

export interface ILocation {
    name: string;
    coords: LatLng;
    isUnlocked: boolean;
    isCompleted: boolean;
    code: string;
    question: IQuestion;
}


export interface IQuestion {
    type: "QR_CODE"|"OPEN";
    description: string;
    img?: string;
    answer: string;
}