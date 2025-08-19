import axios from "axios"
import { salesforceBaseURL } from "../../../config/apiConfig"

export const connectToSalesforce = async () => {
    try {
        const response = await axios.get(`${salesforceBaseURL}/connectToSalesforce`)
        return response.data;
    } catch (error) {
        throw new Error(`Error connecting to Salesforce: ${error.message}`);
    }
}
