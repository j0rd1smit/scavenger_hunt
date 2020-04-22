import {fetchLocationsUrl} from "../routes/Hrefs";
import axios from "axios";
import {getAuth} from "./Auth";
import {ILocationsRepsonse} from "../../server/controllers/LocationController";

export const fetchLocations = async (): Promise<ILocationsRepsonse> => {
    const response = await axios.get(fetchLocationsUrl, {
        auth: getAuth(),
    });

    return await response.data;
}