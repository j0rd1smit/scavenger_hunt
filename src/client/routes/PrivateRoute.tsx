import React, {Fragment, ReactNode} from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import {loginPageUrl} from "./Hrefs";
import {isAuthenticated} from "../utils/Auth";





interface IPrivateRouteProps extends RouteProps {

}

function PrivateRoute(props: IPrivateRouteProps): JSX.Element {
    const {children, ...rest} = props;

    const render = (_: any): ReactNode => {
        if (isAuthenticated()) {
            return children;
        }
        return (
            <Redirect
                to={{
                    pathname: loginPageUrl,
                }}
            />
        );
    }

    return (
        <Fragment>
            <Route
                render={render}
                {...rest}
            />
        </Fragment>
    );
}

export default PrivateRoute;
