import {Response, Router} from "express";
import * as fs from "fs";
import path from "path";
import {ILocation} from "../../utils/Locations";
import {userAuth} from "../Auth";
import {IBasicAuthedRequest} from "express-basic-auth";

const LocationController = Router();

export interface ILocationsRepsonse {
    locations: ILocation[];
}

const progress: any = {};

LocationController.get("/locations", userAuth, async (req: IBasicAuthedRequest, res: Response) => {
    const username = req.auth.user;
    if (progress[username] === undefined) {
        const rawData = await fs.promises.readFile(path.resolve(__dirname, "../data/rijnsoever.json"));
        progress[username] = JSON.parse(rawData.toString("utf8"));
    }

    res.json(progress[username]);
});


export default LocationController;
