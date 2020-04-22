import {fetchLocationsUrl} from "../routes/Hrefs";
import axios from "axios";
import {getAuth} from "./Auth";
import {IGameState} from "../../server/controllers/LocationController";

export const fetchGameState = async (): Promise<IGameState> => {
    const response = await axios.get(fetchLocationsUrl, {
        auth: getAuth(),
    });

    return await response.data;
}

export const saveGameState = async (gameState: IGameState): Promise<void> => {
    const data = {gameState: gameState};
    const options = {auth: getAuth(),}
    await axios.post(fetchLocationsUrl, data, options);
}