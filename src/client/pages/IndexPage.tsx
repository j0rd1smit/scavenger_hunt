import React, {Fragment, useState} from "react";
import {OnClickEvent} from "../utils/ReactTypes";
import NavBar from "../components/NavBar";



function IndexPage(): JSX.Element {
    const [value, setValue] = useState<string>("");


    const onClick = async (e: OnClickEvent): Promise<void> => {
        e.preventDefault();
        const res = await fetch("/api/test");
        const data = await res.json();
        setValue(data["message"]);
    }

    return (
        <Fragment>
            <NavBar/>
            <div>
            <p>Message: {value}</p>

            <button onClick={onClick}>test</button>
            </div>
        </Fragment>
    );
}

export default IndexPage;