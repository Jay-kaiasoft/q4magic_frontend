import axios from "axios"
import { salesforceAccountURL } from "../../../config/apiConfig"

const accessToken = sessionStorage.getItem("accessToken_salesforce");
const instanceUrl = sessionStorage.getItem("instanceUrl_salesforce");

export const getAllAccounts = async () => {
    try {
        const response = await axios.get(`${salesforceAccountURL}/getall?access_token=${accessToken}&instance_url=${instanceUrl}`)
        return response.data;
    } catch (error) {
        throw new Error(`Error in getting all accounts: ${error.message}`);
    }
}

export const getAccountDetails = async (accountId) => {
    try {
        const response = await axios.get(`${salesforceAccountURL}/get/${accountId}?access_token=${accessToken}&instance_url=${instanceUrl}`)
        return response.data;
    } catch (error) {
        throw new Error(`Error in getting account details: ${error.message}`);
    }
}
