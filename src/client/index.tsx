import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import ReactDOM from "react-dom";
import IndexPage from "./pages/IndexPage";


const element = (
    <React.Fragment>
        <CssBaseline/>
        <div>
            <IndexPage/>
        </div>
    </React.Fragment>
);

/**
 * Sets up the react page.
 */
ReactDOM.render(element, document.getElementById("root"));
