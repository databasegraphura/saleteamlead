// src/pages/UntouchedDataPage.js - Team Lead Version (Untouched Data) - REFINED
import React, { useEffect, useState } from 'react';
import userService from '../services/userService';           // To get list of team members for filter
import prospectService from '../services/prospectService';   // For fetching untouched prospects
import reportService from '../services/reportService';       // For KPIs
import transferService from '../services/transferService';   // For transferring data
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import Modal from '../components/Modal/Modal';                // Reusable Modal component
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import tableStyles from './ReportPage.module.css';            // Reusing table/form styles
import formStyles from './ProspectFormPage.module.css';       // Reusing form element styles
import dashboardStyles from './DashboardPage.module.css';     // Reusing KPI card styles

const UntouchedDataPage = () => {
  const [untouchedProspects, setUntouchedProspects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // For 'Member Name' filter
  const [dashboardKpis, setDashboardKpis] = useState(null); // General TL dashboard KPIs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states (for input fields)
  const [memberFilter, setMemberFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Applied filters (these trigger data fetching)
  const [appliedFilters, setAppliedFilters] = useState({
    memberId: '',
    date: '',
  });

  // Modal states for 'Transfer Data' action (remain same)
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProspectForTransfer, setSelectedProspectForTransfer] = useState(null);
  const [targetExecutiveForTransfer, setTargetExecutiveForTransfer] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState('');


  // Fetch initial data (KPIs, Team Members)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch TL dashboard KPIs for the top section
        const kpis = await reportService.getDashboardSummary();
        setDashboardKpis(kpis);

        // Fetch Team Members for the filter dropdown
        const members = await userService.getAllUsers();
        setTeamMembers(members);
        
      } catch (err) {
        console.error('Failed to fetch initial untouched data page info:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load initial untouched data.');
      } finally {
        setLoading(false); // Only set loading false after initial fetches
      }
    };
    fetchInitialData();
  }, []); // Run only on initial mount for KPIs and members


  // Fetch untouched prospects based on applied filters
  useEffect(() => {
    const fetchFilteredUntouchedProspects = async () => {
      setLoading(true); // Set loading specific to prospect table fetch
      setError(null);
      try {
        const data = await prospectService.getUntouchedProspects(appliedFilters);
        setUntouchedProspects(data);
      } catch (err) {
        console.error('Failed to fetch filtered untouched prospects:', err);
        setError(err.response?.data?.message || err.message || 'Failed to apply filter for prospects.');
      } finally {
        setLoading(false);
      }
    };

    // Trigger fetch when appliedFilters change (i.e., when search button is clicked)
    // Only run if dashboardKpis is also loaded to prevent double fetch on initial mount
    if (dashboardKpis || (appliedFilters.memberId || appliedFilters.date)) { // Ensure it fetches on initial load or filter change
      fetchFilteredUntouchedProspects();
    }

  }, [appliedFilters, dashboardKpis]);


  // Handler for the "Search" button click
  const handleSearchClick = (e) => {
    e.preventDefault(); // Prevent form default submission
    setAppliedFilters({
      memberId: memberFilter,
      date: dateFilter,
    });
  };


  // --- Transfer Modal Logic (remains same) ---
  const openTransferModal = (prospect) => {
    setSelectedProspectForTransfer(prospect);
    setTargetExecutiveForTransfer('');
    setTransferError(null);
    setTransferSuccess('');
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
    setSelectedProspectForTransfer(null);
    setTargetExecutiveForTransfer('');
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setTransferLoading(true);
    setTransferError(null);
    setTransferSuccess('');

    if (!targetExecutiveForTransfer) {
      setTransferError('Please select an executive to transfer to.');
      setTransferLoading(false);
      return;
    }
    if (selectedProspectForTransfer.salesExecutive?._id === targetExecutiveForTransfer) { // Use optional chaining for safety
        setTransferError('Prospect is already assigned to the target executive.');
        setTransferLoading(false);
        return;
    }

    try {
      await transferService.transferInternalData({
        sourceUserId: selectedProspectForTransfer.salesExecutive?._id,
        targetUserId: targetExecutiveForTransfer,
        dataIds: [selectedProspectForTransfer._id],
        dataType: 'prospects',
      });
      setTransferSuccess('Prospect transferred successfully!');
      // Update the list by removing the transferred prospect
      setUntouchedProspects(prev => prev.filter(p => p._id !== selectedProspectForTransfer._id));
      closeTransferModal(); // Close modal after successful transfer
    } catch (err) {
      setTransferError(err.response?.data?.message || err.message || 'Failed to transfer prospect.');
    } finally {
      setTransferLoading(false);
    }
  };


  // --- "Import Data" Placeholder (remains same) ---
  const handleImportData = () => {
    alert('Import Data functionality will be implemented here (e.g., CSV upload).');
  };


  if (loading && (!untouchedProspects.length || !dashboardKpis || !teamMembers.length)) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.content}>
      <h1 className={tableStyles.pageTitle}>Untouched Data</h1> {/* Removed (Team Lead) for exact match */}

      {error && <p className={tableStyles.errorMessage}>{error}</p>}

      {/* KPI Cards Section */}
      {dashboardKpis && (
        <div className={dashboardStyles.kpiCards}>
          <div className={dashboardStyles.kpiCard1}>
            <h3>Total Data</h3>
            <p>{dashboardKpis.totalProspect || 0}</p>
          </div>
          <div className={dashboardStyles.kpiCard2}>
            <h3>TODAY CALLS</h3>
            <p>{dashboardKpis.totalCallByTeam || 0}</p>
          </div>
          <div className={dashboardStyles.kpiCard3}>
            <h3>TOTAL PROSPECT</h3>
            <p>{dashboardKpis.totalProspect || 0}</p>
          </div>
          <div className={dashboardStyles.kpiCard4}>
            <h3>TOTAL UNTOUCHED DATA</h3>
            <p>{dashboardKpis.totalUntouchedData || 0}</p> {/* Assumes backend provides this */}
          </div>
        </div>
      )}

      {/* Filters and Import Button */}
      <div className={tableStyles.reportSection}>
        <div className={tableStyles.sectionHeader}>
          <h2 className={tableStyles.sectionTitle}>Filter Untouched Prospects</h2>
          <button onClick={handleImportData} className={tableStyles.searchButton}>Import Data</button>
        </div>
        
        <form onSubmit={handleSearchClick} className={tableStyles.filterForm}>
          <div className={formStyles.formGroup}>
            <label htmlFor="memberId">Member Name</label>
            <select
              id="memberId"
              name="memberId"
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className={formStyles.formInput}
            >
              <option value="">All Members</option>
              {teamMembers.map(member => (
                <option key={member._id} value={member._id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label htmlFor="selectDate">Select Date</label>
            <input
              type="date"
              id="selectDate"
              name="selectDate"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={formStyles.formInput}
            />
          </div>
          <button type="submit" className={tableStyles.searchButton} disabled={loading}>
            {loading ? 'Searching...' : 'Search'} {/* Added Search button */}
          </button>
        </form>
      </div>

      {/* Untouched Prospects Table */}
      <div className={tableStyles.reportSection}>
        <h2 className={tableStyles.sectionTitle}>Untouched Prospects for Team</h2>
        {loading && <LoadingSpinner />}
        {untouchedProspects.length === 0 && !loading && <p>No untouched prospects found based on current filters.</p>}
        {untouchedProspects.length > 0 && (
          <table className={tableStyles.reportTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Last Call</th>
                <th>Sales Executive Name</th>
                <th>Transfer Data</th> {/* Column header name matches screenshot */}
              </tr>
            </thead>
            <tbody>
              {untouchedProspects.map(prospect => (
                <tr key={prospect._id}>
                  <td>{prospect.companyName}</td>
                  <td>{prospect.clientName}</td>
                  <td>{prospect.emailId || 'N/A'}</td>
                  <td>{prospect.lastUpdate ? new Date(prospect.lastUpdate).toLocaleDateString() : 'N/A'}</td>
                  <td>{prospect.salesExecutive ? prospect.salesExecutive.name : 'N/A'}</td>
                  <td>
                    <button onClick={() => openTransferModal(prospect)} className={tableStyles.actionButton}>Select</button> {/* Button text is "Select" */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transfer Prospect Modal (remains same) */}
      {showTransferModal && selectedProspectForTransfer && (
        <Modal onClose={closeTransferModal} title="Transfer Prospect">
          {transferSuccess && <p className={formStyles.successMessage}>{transferSuccess}</p>}
          {transferError && <p className={formStyles.errorMessage}>{transferError}</p>}
          <form onSubmit={handleTransferSubmit} className={formStyles.prospectForm}>
            <div className={formStyles.formGroup}>
              <label>Prospect:</label>
              <input type="text" value={`${selectedProspectForTransfer.clientName} (${selectedProspectForTransfer.companyName})`} disabled className={formStyles.formInput} />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="targetExecutive">Transfer To Executive:</label>
              <select
                id="targetExecutive"
                value={targetExecutiveForTransfer}
                onChange={(e) => setTargetExecutiveForTransfer(e.target.value)}
                className={formStyles.formInput}
                required
              >
                <option value="">Select Executive</option>
                {teamMembers.filter(member => member._id !== selectedProspectForTransfer.salesExecutive?._id).map(member => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className={formStyles.submitButton} disabled={transferLoading}>
              {transferLoading ? 'Transferring...' : 'Transfer'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UntouchedDataPage;