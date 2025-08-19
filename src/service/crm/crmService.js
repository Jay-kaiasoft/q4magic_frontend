import axios from "axios";
import { crmURL } from "../../config/apiConfig";

export const getAllCRM = async () => {
    try {
        const response = await axios.get(`${crmURL}/getAllCRMs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching CRM data:", error);
        throw error;
    }
};

export const getCRM = async (id) => {
    try {
        const response = await axios.get(`${crmURL}/get/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching CRM data:", error);
        throw error;
    }
};
