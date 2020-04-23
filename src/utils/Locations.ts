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

const codeMaskSign = "?";
export const mapCodesToMaskedFormat = (codes: ICode[], nUnlockedLocations: number): ICode[] => {
    const maskedCodes = codes.map(e => {
        return {...e};
    });


    let nCodeCharsToShow = nUnlockedLocations;
    for (let i = 0; i < codes.length; i++) {
        const code = codes[i];
        const maskedCode = maskedCodes[i];
        maskedCode.code = "";
        for (let j = 0; j < code.code.length; j++) {
            if (nCodeCharsToShow > 0) {
                maskedCode.code += code.code[j];
                nCodeCharsToShow -= 1;
            } else {
                maskedCode.code += codeMaskSign;
            }
        }
    }

    return maskedCodes;
}

export const nUnlockableCodes = (codes: ICode[]): number => {
    return codes.map(e => e.code).reduce((acc, code) => acc + code.length, 0)
}

export const findLastUnlockedCode = (codes: ICode[], locations: ILocation[]): ICode|undefined => {
    //const nUnlockedLocations = locations.filter(e => e.isCompleted).length;
    const nUnlockedLocations = 9;
    if (nUnlockedLocations > nUnlockableCodes(codes)) {
        return undefined;
    }

    const maskedCodes = mapCodesToMaskedFormat(codes, nUnlockedLocations);

    const countMaskingSigns = (maskedCode: ICode): number => {
        return (maskedCode.code.match(new RegExp(`${codeMaskSign.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, "g")) || []).length
    }

    for (let i = 0; i < maskedCodes.length - 1; i++) {
        const maskedCode = maskedCodes[i];
        const nextMaskedCode = maskedCodes[i + 1];

        if (countMaskingSigns(maskedCode) > 0 || countMaskingSigns(nextMaskedCode) === nextMaskedCode.code.length) {
            return maskedCode;
        }
    }

    return maskedCodes[maskedCodes.length - 1];

}