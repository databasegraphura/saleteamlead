// src/pages/ReportPage.js - Team Lead Version (Report Page)
import React, { useEffect, useState } from 'react';
import reportService from '../services/reportService'; // For KPIs
import callLogService from '../services/callLogService'; // For Today Call Logs
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from '../components/Modal/Modal';            // Reusable Modal component
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import reportStyles from './ReportPage.module.css';     // Reusing report table/form styles
import dashboardStyles from './DashboardPage.module.css'; // Reusing KPI card styles

const ReportPage = () => {
  const [kpiData, setKpiData] = useState(null);
  const [todayCallLogs, setTodayCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states (reused from SE Report Page)
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({ activity: '', comment: '' });
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch KPIs for the current day for the TL's team
        // The backend's getPerformanceReport automatically filters by TL's scope
        const performanceSummary = await reportService.getPerformanceReport('day');
        // The API returns an array, find the entry for the current TL (if included)
        // Or process as aggregated. The backend TL report is designed to give team-level aggregated if called without teamLeadId.
        // For TL's Report page, the backend's getPerformanceReport should return TL's own report data.
        // For the TL's report, it's typically a list of their executives' daily performance, not aggregated numbers for the TL themselves in the report table.
        // Let's adjust backend report to return TL's own aggregate.
        
        // For now, let's assume `getDashboardSummary` already covers top-level TL KPIs,
        // and we will enhance `getPerformanceReport` to also give TL specific aggregates.
        // Or, use getDashboardSummary again for the TL's KPIs here.
        
        // Using `getDashboardSummary` for the top KPIs for simplicity, as it correctly fetches TL's aggregated data.
        const dashboardSummary = await reportService.getDashboardSummary();
        setKpiData(dashboardSummary);


        // Fetch Today's Call Logs for the Team Lead's Team
        const today = new Date().toISOString().split('T')[0];
        const calls = await callLogService.getAllCallLogs({ date: today });
        setTodayCallLogs(calls);

      } catch (err) {
        console.error('Failed to fetch report data:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred while fetching report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // --- Modal Logic for Update (Identical to SE ReportPage) ---
  const openUpdateModal = (call) => {
    setSelectedCall(call);
    setUpdateFormData({ activity: call.activity, comment: call.comment });
    setUpdateError(null);
    setUpdateSuccess('');
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedCall(null);
    setUpdateFormData({ activity: '', comment: '' });
  };

  const handleUpdateChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // For the modal submission
    setUpdateError(null);
    setUpdateSuccess('');

    try {
      const updatedCall = await callLogService.updateCallLog(selectedCall._id, updateFormData);
      setUpdateSuccess('Call log updated successfully!');
      // Update the call in the list
      setTodayCallLogs(prev => prev.map(call => call._id === updatedCall._id ? updatedCall : call));
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message || 'Failed to update call log.');
    } finally {
      setLoading(false);
    }
  };

  // --- Modal Logic for View (Identical to SE ReportPage) ---
  const openViewModal = (call) => {
    setSelectedCall(call);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedCall(null);
  };
  // --- End Modal Logic ---


  if (loading && !kpiData && !todayCallLogs.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.content}>
      <h1 className={reportStyles.pageTitle}>Team Lead Report</h1>

      {error && <p className={reportStyles.errorMessage}>{error}</p>}

      {/* KPI Cards Section for Team Lead Report */}
      {kpiData && (
        <div className={dashboardStyles.kpiCards}>
          <div className={dashboardStyles.kpiCard1}>
            <h3>Total Data</h3>
            <p>{kpiData.totalClientData || 0}</p> {/* Re-using totalClientData from DashboardSummary for "Total Data" */}
          </div>
          <div className={dashboardStyles.kpiCard2}>
            <h3>TODAY CALLS</h3>
            <p>{kpiData.totalCallByTeam || 0}</p> {/* Re-using totalCallByTeam */}
          </div>
          <div className={dashboardStyles.kpiCard3}>
            <h3>TODAY SALES</h3>
            <p>Rs. {kpiData.todaySales || 0}</p> {/* Assuming `todaySales` is provided in TL dashboard summary too, or aggregate from general dashboard. Backend might need adjustment here to specifically give TL's team today sales. */}
          </div>
          <div className={dashboardStyles.kpiCard4}>
            <h3>TODAY TRANSFER DATA</h3>
            <p>{kpiData.totalTransferData || 0}</p> {/* Placeholder, backend needs to implement TL's today transfer data */}
          </div>
        </div>
      )}

      {/* Today Call Logs Section */}
      <div className={reportStyles.reportSection}>
        <h2 className={reportStyles.sectionTitle}>Today Call Logs (Team)</h2>
        {loading && <LoadingSpinner />}
        {todayCallLogs.length === 0 && !loading && <p>No calls logged by your team today.</p>}
        {todayCallLogs.length > 0 && (
          <table className={reportStyles.reportTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Contact No.</th>
                <th>Activity</th>
                <th>Sales Executive</th> {/* NEW: Display Sales Executive name */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayCallLogs.map(call => (
                <tr key={call._id}>
                  <td>{call.companyName}</td>
                  <td>{call.clientName}</td>
                  <td>{call.emailId || 'N/A'}</td>
                  <td>{call.contactNo || 'N/A'}</td>
                  <td>{call.activity}</td>
                  <td>{call.salesExecutive ? call.salesExecutive.name : 'N/A'}</td>
                  <td>
                    <button onClick={() => openUpdateModal(call)} className={reportStyles.actionButton}>Update</button>
                    <button onClick={() => openViewModal(call)} className={reportStyles.actionButton}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Call Modal (Identical to SE ReportPage) */}
      {showUpdateModal && selectedCall && (
        <Modal onClose={closeUpdateModal} title="Update Call Details">
          <form onSubmit={handleUpdateSubmit} className={reportStyles.modalForm}>
            <div className={reportStyles.formGroup}>
              <label>Company Name</label>
              <input type="text" value={selectedCall.companyName} disabled className={reportStyles.formInput} />
            </div>
            <div className={reportStyles.formGroup}>
              <label>Client Name</label>
              <input type="text" value={selectedCall.clientName} disabled className={reportStyles.formInput} />
            </div>
            <div className={reportStyles.formGroup}>
              <label htmlFor="activity">Activity</label>
              <select
                id="activity"
                name="activity"
                value={updateFormData.activity}
                onChange={handleUpdateChange}
                className={reportStyles.formInput}
                required
              >
                <option value="">Select Activity</option>
                <option value="Talked">Talked</option>
                <option value="Not Talked">Not Talked</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Delete Client's Profile">Delete Client's Profile</option>
              </select>
            </div>
            <div className={reportStyles.formGroup}>
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                name="comment"
                value={updateFormData.comment}
                onChange={handleUpdateChange}
                className={reportStyles.formTextarea}
                rows="3"
              ></textarea>
            </div>
            {updateError && <p className={reportStyles.errorMessage}>{updateError}</p>}
            {updateSuccess && <p className={reportStyles.successMessage}>{updateSuccess}</p>}
            <button type="submit" className={reportStyles.submitButton} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </Modal>
      )}

      {/* View Call Modal (Identical to SE ReportPage) */}
      {showViewModal && selectedCall && (
        <Modal onClose={closeViewModal} title="Call Details">
          <div className={reportStyles.detailItem}>
            <strong>Company Name:</strong> {selectedCall.companyName}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Client Name:</strong> {selectedCall.clientName}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Email ID:</strong> {selectedCall.emailId || 'N/A'}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Contact No.:</strong> {selectedCall.contactNo || 'N/A'}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Call Date:</strong> {new Date(selectedCall.callDate).toLocaleString()}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Activity:</strong> {selectedCall.activity}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Comment:</strong> {selectedCall.comment || 'No comment'}
          </div>
          {selectedCall.prospect && (
            <div className={reportStyles.detailItem}>
              <strong>Related Prospect:</strong> {selectedCall.prospect.companyName} - {selectedCall.prospect.clientName}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ReportPage;