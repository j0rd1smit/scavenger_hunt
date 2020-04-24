import express, {Request, Response} from "express";
import * as fs from "fs";
import bodyParser from "body-parser";
import AuthController from "./controllers/AuthController";
import LocationController from "./controllers/LocationController";
import * as https from "https";
import * as http from "http";
import * as yargs from 'yargs';

const argv = yargs.options({
    key: {
        alias: 'k',
        default: 'server.key',
        description: 'https server.key file'
    },
    cert: {
        alias: 'c',
        default: 'server.cert',
        description: 'https server.cert file'
    },
    dev: {
        type: 'boolean',
        default: false,
    }
}).argv;

console.log(argv);

const app = express();
export const httpPort = 80;
export const httpsPort = 443;

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


/**
 * The https server.
 */
https.createServer({
    key: fs.readFileSync(argv.key),
    cert: fs.readFileSync(argv.cert),
}, app).listen(httpsPort, () => console.log(`Listening on port http ${httpPort} and https ${httpsPort}`));


/**
 * redirect http to https.
 */
if (!argv.dev) {
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(httpPort);
} else {
    http.createServer(app).listen(httpPort, () => console.log(`Listening on port for http in dev mode.`))
}
