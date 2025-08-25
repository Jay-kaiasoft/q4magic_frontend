import axios from "axios";
import { contactURL } from "../../config/apiConfig";

export const getAllContacts = async () => {
    try {
        const response = await axios.get(`${contactURL}/get/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
    }
};

export const getContactDetails = async (contactId) => {
    try {
        const response = await axios.get(`${contactURL}/get/${contactId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching contact details:", error);
        throw error;
    }
};

export const createContact = async (contactData) => {
    try {
        const response = await axios.post(`${contactURL}/create`, contactData);
        return response.data;
    } catch (error) {
        console.error("Error creating contact:", error);
        throw error;
    }
};

export const updateContact = async (contactId, contactData) => {
    try {
        const response = await axios.patch(`${contactURL}/update/${contactId}`, contactData);
        return response.data;
    } catch (error) {
        console.error("Error updating contact:", error);
        throw error;
    }
};

export const deleteContact = async (contactId) => {
    try {
        const response = await axios.delete(`${contactURL}/delete/${contactId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting contact:", error);
        throw error;
    }
};
