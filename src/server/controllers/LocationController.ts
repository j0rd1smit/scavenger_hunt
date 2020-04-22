import {Request, Response, Router} from "express";
import * as fs from "fs";
import path from "path";
import {ILocation} from "../../utils/Locations";

const LocationController = Router();

export interface ILocationsRepsonse {
    locations: ILocation[];
}

LocationController.get("/locations", async (req: Request, res: Response) => {
    const data = await fs.promises.readFile(path.resolve(__dirname, "../data/rijnsoever.json"));
    res.json(JSON.parse(data.toString("utf8")));
});


export default LocationController;
