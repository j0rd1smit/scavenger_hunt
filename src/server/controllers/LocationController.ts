import {Response, Router} from "express";
import * as fs from "fs";
import path from "path";
import {userAuth} from "../Auth";
import {IBasicAuthedRequest} from "express-basic-auth";
import {IGameState} from "../../utils/Locations";

const LocationController = Router();


const progress: any = {};

LocationController.get("/locations", userAuth, async (req: IBasicAuthedRequest, res: Response) => {
    const username = req.auth.user;
    if (progress[username] === undefined) {
        const rawData = await fs.promises.readFile(path.resolve(__dirname, "../data/rijnsoever.json"));
        progress[username] = JSON.parse(rawData.toString("utf8"));
        console.log("stored for", username);
    }

    res.json(progress[username]);

});

LocationController.post("/locations", userAuth, async (req: IBasicAuthedRequest, res: Response) => {
    const username = req.auth.user;
    const {gameState} = req.body;
    const prevGameState = progress[username];

    if (prevGameState !== undefined && gameStateIsValid(gameState, prevGameState)) {
        progress[username] = gameState;

        res.json({
            error: false,
            message: "Your game state has succesfully been saved."
        });
        console.log(`Save the game for ${username}.`)
    } else {
        res.json({
            error: true,
            message: "gameState was not provided in the body."
        });
    }

});

const gameStateIsValid = (gameState: IGameState|undefined|null, previousState: IGameState): boolean => {
    if (gameState === undefined || gameState === null) {
        return false;
    }

    if (objectsHaveSameKeys(gameState, previousState) && gameState.locations.length !== previousState.locations.length) {
        return false;
    }

    return true;
}

const objectsHaveSameKeys = (...objects: any): boolean => {
    const allKeys = objects.reduce((keys: string[], object: object) => keys.concat(Object.keys(object)), []);
    const union = new Set(allKeys);
    return objects.every((object: object) => union.size === Object.keys(object).length);
}

export default LocationController;
