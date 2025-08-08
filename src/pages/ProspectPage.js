// src/pages/ProspectPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import prospectService from '../services/prospectService';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from '../components/Modal/Modal';
import ProspectUpdateModal from '../components/ProspectUpdateModal/ProspectUpdateModal';
import styles from '../components/Layout/Layout.module.css';
import tableStyles from './ReportPage.module.css';

const ProspectPage = () => {
  const [prospects, setProspects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch Team Members for the filter dropdown
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const members = await userService.getAllUsers();
        setTeamMembers(members);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load team members for filters.');
      }
    };
    fetchTeamMembers();
  }, []);

  // Fetch Prospects based on filters OR a refresh signal
  useEffect(() => {
    const fetchProspects = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (selectedMemberId) filters.memberId = selectedMemberId;
        if (selectedDate) filters.date = selectedDate;

        const data = await prospectService.getAllProspects(filters);
        setProspects(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred while fetching prospects.');
        setProspects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProspects();

    // ---- Handle navigation state refresh signal ----
    if (location.state?.refresh) {
      // Remove 'refresh' state after consuming it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [selectedMemberId, selectedDate, location, navigate]);

  // Modal Logic for Update
  const openUpdateModal = (prospect) => {
    // console.log(prospect);
    
    setSelectedProspect(prospect);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedProspect(null);
  };

  // Function passed to the modal, called on form submit
  const handleUpdateProspect = async (prospectId, formData) => {
    setLoading(true);
    try {
      const updatedProspect = await prospectService.updateProspect(prospectId, formData);
      setProspects(prev => prev.map(p => p._id === updatedProspect._id ? updatedProspect : p));
      closeUpdateModal();
      return updatedProspect;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modal Logic for View Last Update
  const openViewModal = (prospect) => {
    setSelectedProspect(prospect);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedProspect(null);
  };

  if (loading && !prospects.length && !teamMembers.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.content}>
      <h1 className={tableStyles.pageTitle}>Total Prospect (Team)</h1>

      {error && <p className={tableStyles.errorMessage}>{error}</p>}

      {/* Filters Section */}
      <div className={tableStyles.reportSection}>
        <h2 className={tableStyles.sectionTitle}>Filter Prospects</h2>
        <form className={tableStyles.filterForm}>
          <div className={tableStyles.formGroup}>
            <label htmlFor="memberId">Member Name</label>
            <select
              id="memberId"
              name="memberId"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className={tableStyles.formInput}
            >
              <option value="">All Members</option>
              {teamMembers.map(member => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div className={tableStyles.formGroup}>
            <label htmlFor="selectDate">Select Date</label>
            <input
              type="date"
              id="selectDate"
              name="selectDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={tableStyles.formInput}
            />
          </div>
          <div>
            <button type="button" className={tableStyles.searchButton}>
              Search
            </button>
          </div>

        </form>
      </div>

      {/* Prospects Table */}
      <div className={tableStyles.reportSection}>
        <h2 className={tableStyles.sectionTitle}>Your Team's Prospects</h2>
        {loading && <LoadingSpinner />}
        {prospects.length === 0 && !loading && (
          <p>No prospects found for your team based on current filters.</p>
        )}
        {prospects.length > 0 && (
          <table className={tableStyles.reportTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Contact No.</th>
                <th>Reminder Date</th>
                <th>Activity</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prospects.map(prospect => (
                <tr key={prospect._id}>
                  <td>{prospect.companyName}</td>
                  <td>{prospect.clientName}</td>
                  <td>{prospect.emailId || 'N/A'}</td>
                  <td>{prospect.contactNo || 'N/A'}</td>
                  <td>{prospect.reminderDate ? new Date(prospect.reminderDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{prospect.activity}</td>
                  <td>{prospect.lastUpdate ? new Date(prospect.lastUpdate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button
                      onClick={() => openUpdateModal(prospect)}
                      className={tableStyles.actionButton}
                    >Update</button>
                    <button
                      onClick={() => openViewModal(prospect)}
                      className={tableStyles.actionButton}
                    >View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Prospect Modal */}
      {showUpdateModal && selectedProspect && (
        // <h1>hii</h1>
        <ProspectUpdateModal
          prospect={selectedProspect}
          onClose={closeUpdateModal}
          onUpdateSuccess={handleUpdateProspect}
          isLoading={loading}
        />
      )}

      {/* View Last Update Modal */}
      {showViewModal && selectedProspect && (
        <Modal onClose={closeViewModal} title="Prospect Details & Last Update">
          <div className={tableStyles.detailItem}>
            <strong>Company Name:</strong> {selectedProspect.companyName}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Client Name:</strong> {selectedProspect.clientName}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Email ID:</strong> {selectedProspect.emailId || 'N/A'}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Contact No.:</strong> {selectedProspect.contactNo || 'N/A'}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Reminder Date:</strong> {selectedProspect.reminderDate ? new Date(selectedProspect.reminderDate).toLocaleDateString() : 'N/A'}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Current Activity:</strong> {selectedProspect.activity}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Last Update:</strong> {selectedProspect.lastUpdate ? new Date(selectedProspect.lastUpdate).toLocaleString() : 'N/A'}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Comment:</strong> {selectedProspect.comment || 'No comment'}
          </div>
          <div className={tableStyles.detailItem}>
            <strong>Sales Executive:</strong> {selectedProspect.salesExecutive?.name || 'N/A'}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProspectPage;