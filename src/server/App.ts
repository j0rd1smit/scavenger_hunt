import express, {Request, Response} from "express";
import * as fs from "fs";



const app = express();
export const port = 8080;

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
