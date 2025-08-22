import axios from "axios";
import { syncRecordsURL } from "../../config/apiConfig";

export const getAllSyncRecords = async () => {
    try {
        const response = await axios.get(`${syncRecordsURL}/get/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching sync records:", error);
        throw error;
    }
};
