import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import Routes from "./routes/Routes";


const element = (
    <React.Fragment>
        <CssBaseline/>
        <BrowserRouter>
            <Routes/>
        </BrowserRouter>
    </React.Fragment>
);

/**
 * Sets up the react page.
 */
ReactDOM.render(element, document.getElementById("root"));
