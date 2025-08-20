import axios from "axios";
import { syncFromQ4magicURL } from "../../../config/apiConfig";

const accessToken = sessionStorage.getItem("accessToken_salesforce");
const instanceUrl = sessionStorage.getItem("instanceUrl_salesforce");

export const syncAccountsFromQ4Magic = async () => {
    try {
        const response = await axios.get(`${syncFromQ4magicURL}/accounts?access_token=${accessToken}&instance_url=${instanceUrl}`);
        return response.data;
    } catch (error) {
        console.error("Error syncing from Q4Magic:", error);
        throw error;
    }
};
