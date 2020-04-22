import {Response, Router} from "express";
import {IBasicAuthedRequest} from "express-basic-auth";
import {userAuth} from "../Auth";

const AuthController = Router();


export interface IAuthResponseBody {
    authenticated: boolean;
    username: string;
}

AuthController.get("/auth", userAuth, (req: IBasicAuthedRequest, res: Response) => {
    const body: IAuthResponseBody = {
        authenticated: true,
        username: req.auth.user,
    }
    res.json(body);
});


export default AuthController;
