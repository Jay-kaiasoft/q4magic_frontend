import axios from "axios";
import { opportunityURL } from "../../config/apiConfig";

export const getAllOpportunities = async () => {
    try {
        const response = await axios.get(`${opportunityURL}/get/all`);
        return response.data;
    } catch (error) {
        console.error("Error fetching opportunities:", error);
        throw error;
    }
};

export const getOpportunityDetails = async (opportunityId) => {
    try {
        const response = await axios.get(`${opportunityURL}/get/${opportunityId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching opportunity details:", error);
        throw error;
    }
};

export const createOpportunity = async (opportunityData) => {
    try {
        const response = await axios.post(`${opportunityURL}/create`, opportunityData);
        return response.data;
    } catch (error) {
        console.error("Error creating opportunity:", error);
        throw error;
    }
};

export const updateOpportunity = async (opportunityId, opportunityData) => {
    try {
        const response = await axios.patch(`${opportunityURL}/update/${opportunityId}`, opportunityData);
        return response.data;
    } catch (error) {
        console.error("Error updating opportunity:", error);
        throw error;
    }
};

export const deleteOpportunity = async (opportunityId) => {
    try {
        const response = await axios.delete(`${opportunityURL}/delete/${opportunityId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting opportunity:", error);
        throw error;
    }
};
