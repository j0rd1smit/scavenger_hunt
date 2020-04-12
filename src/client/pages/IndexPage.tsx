import React, {Fragment, useState} from "react";
import {OnClickEvent} from "../utils/ReactTypes";


function IndexPage(): JSX.Element {
    const [value, setValue] = useState<string>('');

    const onClick = async (e: OnClickEvent): Promise<void> => {
        e.preventDefault();
        const res = await fetch("/api/test");
        const data = await res.json();
        setValue(data["message"]);
    }

    return (
        <Fragment>
            Message: {value}
            <button onClick={onClick}>test</button>
        </Fragment>
    );
}

export default IndexPage;