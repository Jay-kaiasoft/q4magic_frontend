import axios from "axios";
import { q4magicSyncURL } from "../../../config/apiConfig";


export const syncToQ4Magic = async () => {
    const accessToken = sessionStorage.getItem("accessToken_salesforce");
    const instanceUrl = sessionStorage.getItem("instanceUrl_salesforce");
    try {
        const response = await axios.get(`${q4magicSyncURL}?access_token=${accessToken}&instance_url=${instanceUrl}`);
        return response.data;
    } catch (error) {
        console.error("Error syncing to Q4Magic:", error);
        throw error;
    }
};
