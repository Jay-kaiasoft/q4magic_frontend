import axios from "axios";
import { q4magicSyncURL } from "../../../config/apiConfig";

const accessToken = sessionStorage.getItem("accessToken_salesforce");
const instanceUrl = sessionStorage.getItem("instanceUrl_salesforce");

export const syncAccountsToQ4Magic = async () => {
    try {
        const response = await axios.get(`${q4magicSyncURL}/accounts?access_token=${accessToken}&instance_url=${instanceUrl}`);
        return response.data;
    } catch (error) {
        console.error("Error syncing to Q4Magic:", error);
        throw error;
    }
};
