import {Request, Response, Router} from "express";
import * as fs from "fs";
import path from "path";

const LocationController = Router();

LocationController.get("/locations", async (req: Request, res: Response) => {
    const data = await fs.promises.readFile(path.resolve(__dirname, "../data/rijnsoever.json"));
    res.json(JSON.parse(data.toString("utf8")));
});


export default LocationController;
