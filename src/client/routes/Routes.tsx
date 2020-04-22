import React, {Fragment} from "react";
import {Route, Switch} from "react-router";
import IndexPage from "../pages/IndexPage";
import {indexPageUrl, loginPageUrl} from "./Hrefs";
import NoMatch404Page from "../pages/NoMatch404Page";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage";


interface IRoutesProps {

}

function Routes(props: IRoutesProps): JSX.Element {
    return (
        <Fragment>
            <Switch>
                <PrivateRoute
                    exact
                    path={indexPageUrl}
                    component={IndexPage}
                />
                <Route
                    exact
                    path={loginPageUrl}
                    component={LoginPage}
                />
                <Route
                    path={"*"}
                    component={NoMatch404Page}
                />
            </Switch>
        </Fragment>
    );
}

export default Routes;
