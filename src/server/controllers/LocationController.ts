import {Response, Router} from "express";
import * as fs from "fs";
import path from "path";
import {ILocation} from "../../utils/Locations";
import {userAuth} from "../Auth";
import {IBasicAuthedRequest} from "express-basic-auth";

const LocationController = Router();

export interface IGameState {
    locations: ILocation[];
}

const progress: any = {};

LocationController.get("/locations", userAuth, async (req: IBasicAuthedRequest, res: Response) => {
    const username = req.auth.user;
    console.log(progress[username] === undefined);
    if (progress[username] === undefined) {
        const rawData = await fs.promises.readFile(path.resolve(__dirname, "../data/rijnsoever.json"));
        progress[username] = JSON.parse(rawData.toString("utf8"));
    }

    res.json(progress[username]);

});

LocationController.post("/locations", userAuth, async (req: IBasicAuthedRequest, res: Response) => {
    const username = req.auth.user;
    const {gameState} = req.body;
    const prevGameState = progress[username];

    //TODO validate input.
    if (gameStateIsValid(gameState, prevGameState)) {
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

    if (gameState.locations.length !== previousState.locations.length) {
        return false;
    }

    return true;
}


export default LocationController;
