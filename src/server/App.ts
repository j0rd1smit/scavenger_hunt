import express, {Request, Response} from "express";
import * as fs from "fs";


const app = express();
export const port = 8080;




app.get("/api/test", (req: Request, res: Response) => {
    res.json({"message": "test"});
});


/**
 *  Route the index page to react.
 */
app.use(express.static("dist"));
app.use(express.static("public"));

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
