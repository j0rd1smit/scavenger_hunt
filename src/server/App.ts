import express, {Request, Response} from "express";
import * as fs from "fs";
import bodyParser from "body-parser";
import AuthController from "./controllers/AuthController";
import LocationController from "./controllers/LocationController";


const app = express();
export const port = 8080;

app.use(bodyParser.urlencoded({extended: false, limit: "5mb"}));
app.use(bodyParser.json());

/**
 *  Route the index page to react.
 */
app.use(express.static("dist"));
app.use(express.static("public"));


app.use(`/api`, AuthController);
app.use(`/api`, LocationController);


/**
 * fallback method production
 */
app.get("*", (req: Request, res: Response) => {
    fs.readFile("dist/index.html", "utf8", (error: Error, html: string) => {
        res.send(html);
    });
});


// noinspection TsLint
app.listen(port, () => console.log("Listening on port 8080"));
