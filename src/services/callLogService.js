// src/services/callLogService.js
import api from './api';

const callLogService = {
  // Creates a new call log record
  createCallLog: async (callLogData) => {
    try {
      const response = await api.post('/calllogs', callLogData);
      return response.data.data.callLog;
    } catch (error) {
      console.error('Error creating call log:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Fetches all call log records (backend filters by role)
  getAllCallLogs: async (filters = {}) => {
    try {
      const response = await api.get('/calllogs', { params: filters });
      return response.data.data.callLogs;
    } catch (error) {
      console.error('Error fetching all call logs:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Fetches a single call log record by ID (backend checks permissions)
  getCallLog: async (id) => {
    try {
      const response = await api.get(`/calllogs/${id}`);
      return response.data.data.callLog;
    } catch (error) {
      console.error('Error fetching call log:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Updates an existing call log record (backend checks permissions)
  updateCallLog: async (id, callLogData) => {
    try {
      const response = await api.patch(`/calllogs/${id}`, callLogData);
      return response.data.data.callLog;
    } catch (error) {
      console.error('Error updating call log:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
};

export default callLogService;