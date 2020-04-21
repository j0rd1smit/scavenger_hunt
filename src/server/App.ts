import express, {NextFunction, Request, Response} from "express";
import * as fs from "fs";
import bodyParser from "body-parser";
import {findUser, generateAuthToken, getUserFromToken, isPasswordCorrect} from "./Auth";
const cookieParser = require('cookie-parser')


const app = express();
export const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser({limit: "50mb"}));
app.use(cookieParser());

/**
 *  Route the index page to react.
 */
app.use(express.static("dist"));
app.use(express.static("public"));

app.use((req: any, res: Response, next: NextFunction) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];
    console.log("authToken", authToken);

    // Inject the user to the request
    req.user = getUserFromToken(authToken);
    console.log("user", getUserFromToken(authToken));

    next();
});



app.post('/login', (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = findUser(username);

    if (user !== undefined && isPasswordCorrect(user, password)) {
        const authToken = generateAuthToken(user);

        // Setting the auth token in cookies
        res.cookie('AuthToken', authToken, {httpOnly: true});


        // Redirect user to the protected page
        res.json({
            sucess: true,
            message: "You are now logged in.",
            redicrect: "/",
        });
    } else {
        res.json({
            sucess: false,
            message: "We couldn't log you in with these credentials."
        });
    }
});

app.get('/protected', (req: any, res: Response): void => {
    if (req.user) {
        res.json({message: 'you are logged in.'});
    } else {
        res.json({message: 'you are not logged in.'});
    }
});


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
