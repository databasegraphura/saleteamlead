// src/services/prospectService.js - UPDATED with console.logs for debugging
import api from './api';

const prospectService = {
  createProspect: async (prospectData) => {
    try {
      // --- DEBUGGING LOG START ---
      console.log("ProspectService: Sending data to backend /prospects:", prospectData);
      // --- DEBUGGING LOG END ---

      const response = await api.post('/prospects', prospectData);

      // --- DEBUGGING LOG START ---
      console.log("ProspectService: Backend response for createProspect:", response.data);
      // --- DEBUGGING LOG END ---

      return response.data.data.prospect;
    } catch (error) {
      console.error('ProspectService: Error creating prospect. Error details:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getAllProspects: async (filters = {}) => {
    try {
      const response = await api.get('/prospects', { params: filters });
      return response.data.data.prospects;
    } catch (error) {
      console.error('Error fetching all prospects:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getProspect: async (id) => {
    try {
      const response = await api.get(`/prospects/${id}`);
      return response.data.data.prospect;
    } catch (error) {
      console.error('Error fetching prospect:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  updateProspect: async (id, prospectData) => {
    try {
      const response = await api.patch(`/prospects/${id}`, prospectData);
      return response.data.data.prospect;
    } catch (error) {
      console.error('Error updating prospect:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  deleteProspect: async (id) => {
    try {
      await api.delete(`/prospects/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting prospect:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  getUntouchedProspects: async (filters = {}) => {
    try {
      const response = await api.get('/prospects/untouched', { params: filters });
      return response.data.data.prospects;
    } catch (error) {
      console.error('Error fetching untouched prospects:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default prospectService;