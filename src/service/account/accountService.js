import axios from "axios";
import { accountURL } from "../../config/apiConfig";

export const getAllAccounts = async () => {
    try {
        const response = await axios.get(`${accountURL}/getall`);
        return response.data;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
};

export const getAccountDetails = async (accountId) => {
    try {
        const response = await axios.get(`${accountURL}/get/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching account details:", error);
        throw error;
    }
};

export const createAccount = async (accountData) => {
    try {
        const response = await axios.post(`${accountURL}/create`, accountData);
        return response.data;
    } catch (error) {
        console.error("Error creating account:", error);
        throw error;
    }
};

export const updateAccount = async (accountId, accountData) => {
    try {
        const response = await axios.patch(`${accountURL}/update/${accountId}`, accountData);
        return response.data;
    } catch (error) {
        console.error("Error updating account:", error);
        throw error;
    }
};

export const deleteAccount = async (accountId) => {
    try {
        const response = await axios.delete(`${accountURL}/delete/${accountId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
    }
};
