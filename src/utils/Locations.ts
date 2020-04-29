import {distanceInMetersBetween} from "../client/utils/GeoUtils";
import {isPresent} from "../client/utils/utils";


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
    pieces: ICodePiece[];
}

export interface ICodePiece {
    unlocksAt: number;
    value: string;
}

const codeMaskSign = "?";
export class Code {
    public readonly icode: ICode;
    private nUnlockedLocations: number;

    constructor(icode: ICode, nUnlockedLocations: number) {
        this.icode = icode;
        this.nUnlockedLocations = nUnlockedLocations;
        console.assert(this.icode.pieces.length > 0);
    }

    public maskedCode = (): string => {
        return this.icode.pieces.map(piece => {
            if (this.isPieceUnlocked(piece)) {
                return piece.value
            }
            return codeMaskSign;
        }).join("")
    }

    private isPieceUnlocked = (piece: ICodePiece): boolean => {
        return this.nUnlockedLocations >= piece.unlocksAt;
    }

    public isFullUnlocked = (): boolean => {
        return this.icode.pieces.filter(this.isPieceUnlocked).length === this.icode.pieces.length;
    }

    public isParialyUnlocked = (): boolean => {
        return this.icode.pieces.filter(this.isPieceUnlocked).length > 0;
    }


    public unlocksAt = (n: number): boolean => {
        return this.icode.pieces.map(e => e.unlocksAt).includes(n);
    }

    public nextUnlockAt = (): number|undefined => {
        const notYetUnlockedPieces = this.icode.pieces.filter(e => !this.isPieceUnlocked(e))
        if (notYetUnlockedPieces.length === 0) {
            return undefined;
        }
        return Math.min(... notYetUnlockedPieces.map(e => e.unlocksAt))
    }
}

export const findLastUnlockedCode = (icodes: ICode[], nUnlockedLocations: number): undefined|Code => {
    const codes = icodes.map(c => new Code(c, nUnlockedLocations));
    return codes.find(c => c.unlocksAt(nUnlockedLocations));
}

export const findNextUnlockedAt = (icodes: ICode[], nUnlockedLocations: number): undefined|number => {
    const codes = icodes.map(c => new Code(c, nUnlockedLocations));
    const nextUnlockMoments = codes.map(c => c.nextUnlockAt()).filter(isPresent);
    if (nextUnlockMoments.length === 0) {
        return undefined;
    }
    return  Math.min(... nextUnlockMoments);
}

export const totalNPieces = (icodes: ICode[]): number => {
    return icodes.map(e => e.pieces.length).reduce((a, b) => a + b, 0);
}


