import React, {Fragment, } from "react";
import {useGlobalGameStore} from "../utils/GlobalGameStateStore";




interface INoMatch404PageProps {

}



function NoMatch404Page(props: INoMatch404PageProps): JSX.Element {
    // Usage
    const [state, {}] = useGlobalGameStore();

    return (
        <Fragment>
            <div>
                <p>
                    {JSON.stringify(state.gameState)}
                </p>


                <Test/>
            </div>
        </Fragment>
    );
}

interface ITestProps {
}

function Test(props: ITestProps): JSX.Element {

    const [state, {fetchGameState, setSelectedLocation, markLocationAsCompleted, unlockLocations}] = useGlobalGameStore();
    return (
        <Fragment>
            <div>
                <button onClick={e => fetchGameState()}>Fetch</button>
                {state.gameState.locations.length > 0 && (
                    <div>
                        <button onClick={e => setSelectedLocation(state.gameState.locations[0])}>set selectedLocation</button>
                        <button onClick={e => markLocationAsCompleted(state.gameState.locations[0])}>mark completed</button>
                        <button onClick={e => unlockLocations(state.gameState.locations[0].coords)}>unlock</button>
                    </div>
                    )
                }
            </div>
        </Fragment>
    );
}

export default NoMatch404Page;
