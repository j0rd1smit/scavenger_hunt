import React, {Fragment} from "react";
import {Route, Switch} from "react-router";
import IndexPage from "../pages/IndexPage";
import {indexPageUrl, loginPageUrl, permissionsPageUrl} from "./Hrefs";
import NoMatch404Page from "../pages/NoMatch404Page";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage";
import PremissionPage from "../pages/PremissionPage";


interface IRoutesProps {

}

function Routes(props: IRoutesProps): JSX.Element {
    try {
        return (
            <Fragment>
                <Switch>
                    <PrivateRoute
                        exact
                        path={indexPageUrl}
                    >
                        <IndexPage/>
                    </PrivateRoute>
                    <Route
                        exact
                        path={loginPageUrl}
                        component={LoginPage}
                    />
                    <Route
                        exact
                        path={permissionsPageUrl}
                        component={PremissionPage}
                    />
                    <Route
                        path={"*"}
                        component={NoMatch404Page}
                    />
                </Switch>
            </Fragment>
        );
    } catch (e) {
        throw e;
        //TODO window.location.reload();
        //TODO catch un authenticate error.
    }

}

export default Routes;
