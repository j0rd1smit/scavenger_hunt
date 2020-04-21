import {Response, Router} from "express";
import {IBasicAuthedRequest} from "express-basic-auth";
import {userAuth} from "../Auth";

const AuthController = Router();

AuthController.get("/auth", userAuth, (req: IBasicAuthedRequest, res: Response) => {
    res.json({
        authenticated: true,
        user: req.auth.user,
    })
});


export default AuthController;
