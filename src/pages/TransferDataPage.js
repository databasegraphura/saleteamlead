// src/pages/TransferDataPage.js - Team Lead Version (Transfer Data)
import React, { useEffect, useState } from 'react';
import userService from '../services/userService';       // To get list of team members for dropdowns
import prospectService from '../services/prospectService'; // To fetch prospects for transfer
import salesService from '../services/salesService';     // To fetch sales for transfer
import transferService from '../services/transferService'; // For initiating transfers and fetching history
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import tableStyles from './ReportPage.module.css';        // Reusing table styles
import formStyles from './ProspectFormPage.module.css';   // Reusing form element styles

const TransferDataPage = () => {
  const [teamMembers, setTeamMembers] = useState([]); // All execs + current TL for dropdowns
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transfer Form states
  const [sourceUserId, setSourceUserId] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  const [transferDataType, setTransferDataType] = useState('prospects'); // 'prospects' or 'sales'
  const [transferCount, setTransferCount] = useState(''); // "Transfer Data in No."
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState('');

  // Fetch Team Members (current TL and their direct Sales Executives) for dropdowns
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        // Backend's getAllUsers filters to TL's direct reports if TL is logged in
        const directExecs = await userService.getAllUsers();
        // The TL themselves can also be a source/target
        const currentUser = await userService.getMe(); // Get current TL user
        setTeamMembers([currentUser, ...directExecs]);
      } catch (err) {
        console.error('Failed to fetch team members for transfer:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load members for transfer dropdowns.');
      } finally {
        setLoading(false);
      }
    };

    const fetchTransferHistory = async () => {
        try {
            const history = await transferService.getInternalTransferHistory();
            setTransferHistory(history);
        } catch (err) {
            console.error('Failed to fetch transfer history:', err);
            // Don't block whole page on history error, just log
        }
    };

    fetchMembers();
    fetchTransferHistory();
  }, []);

  // --- Transfer Form Handler ---
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setTransferLoading(true);
    setTransferError(null);
    setTransferSuccess('');

    if (!sourceUserId || !targetUserId || !transferCount || !transferDataType) {
      setTransferError('Please select source, target, data type, and count.');
      setTransferLoading(false);
      return;
    }
    if (sourceUserId === targetUserId) {
        setTransferError('Source and target members cannot be the same.');
        setTransferLoading(false);
        return;
    }
    if (isNaN(transferCount) || parseInt(transferCount, 10) <= 0) {
        setTransferError('Transfer count must be a positive number.');
        setTransferLoading(false);
        return;
    }

    try {
      let recordsToTransfer = [];
      if (transferDataType === 'prospects') {
        // Fetch prospects belonging to source user
        const sourceProspects = await prospectService.getAllProspects({ salesExecutive: sourceUserId });
        recordsToTransfer = sourceProspects.slice(0, parseInt(transferCount, 10)); // Select top N
      } else if (transferDataType === 'sales') {
        // Fetch sales belonging to source user
        const sourceSales = await salesService.getAllSales({ salesExecutive: sourceUserId });
        recordsToTransfer = sourceSales.slice(0, parseInt(transferCount, 10)); // Select top N
      }

      if (recordsToTransfer.length === 0) {
        setTransferError(`No ${transferDataType} found for the source member to transfer, or less than specified count.`);
        setTransferLoading(false);
        return;
      }

      const dataIds = recordsToTransfer.map(rec => rec._id);

      await transferService.transferInternalData({
        sourceUserId,
        targetUserId,
        dataIds,
        dataType: transferDataType,
      });

      setTransferSuccess(`${recordsToTransfer.length} ${transferDataType} transferred successfully!`);
      // Clear form and re-fetch history
      setSourceUserId('');
      setTargetUserId('');
      setTransferCount('');
      await setTransferHistory(await transferService.getInternalTransferHistory()); // Update history
    } catch (err) {
      console.error('Transfer failed:', err.response ? err.response.data : err.message);
      setTransferError(err.response?.data?.message || err.message || 'Data transfer failed.');
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={`${styles.content} ${tableStyles.errorContainer}`}>
        <h2>Error Loading Transfer Data Page</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={tableStyles.pageTitle}>Transfer Data (Team Lead)</h1>

      {/* Data Transfer Form */}
      <div className={tableStyles.reportSection}>
        <h2 className={tableStyles.sectionTitle}>Internal Data Transfer</h2>
        {transferSuccess && <p className={formStyles.successMessage}>{transferSuccess}</p>}
        {transferError && <p className={formStyles.errorMessage}>{transferError}</p>}

        <form onSubmit={handleTransferSubmit} className={tableStyles.filterForm}> {/* Reusing filterForm for layout */}
          <div className={formStyles.formGroup}>
            <label htmlFor="sourceMember">Source Member</label>
            <select
              id="sourceMember"
              value={sourceUserId}
              onChange={(e) => setSourceUserId(e.target.value)}
              className={formStyles.formInput}
              required
            >
              <option value="">Select Source</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>{member.name} ({member.role.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')})</option>
              ))}
            </select>
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="targetMember">Target Member</label>
            <select
              id="targetMember"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              className={formStyles.formInput}
              required
            >
              <option value="">Select Target</option>
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>{member.name} ({member.role.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')})</option>
              ))}
            </select>
          </div>
          
          <div className={formStyles.formGroup}>
            <label htmlFor="dataType">Data Type</label>
            <select
              id="dataType"
              value={transferDataType}
              onChange={(e) => setTransferDataType(e.target.value)}
              className={formStyles.formInput}
              required
            >
              <option value="prospects">Prospects</option>
              <option value="sales">Sales</option>
            </select>
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="transferCount">Transfer Data in No.</label>
            <input
              type="number"
              id="transferCount"
              value={transferCount}
              onChange={(e) => setTransferCount(e.target.value)}
              className={formStyles.formInput}
              min="1"
              required
            />
          </div>

          <button type="submit" className={tableStyles.searchButton} disabled={transferLoading}>
            {transferLoading ? 'Transferring...' : 'Transfer'}
          </button>
        </form>
      </div>

      {/* Transfer Data History */}
      <div className={tableStyles.reportSection}>
        <h2 className={tableStyles.sectionTitle}>Transfer Data History</h2>
        {transferHistory.length === 0 && !loading && <p>No transfer history found.</p>}
        {transferHistory.length > 0 && (
          <table className={tableStyles.reportTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Transfer Type</th>
                <th>From</th>
                <th>To</th>
                <th>Count</th>
                <th>Transferred By</th>
              </tr>
            </thead>
            <tbody>
              {transferHistory.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.transferDate).toLocaleDateString()}</td>
                  <td>{log.transferType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                  <td>{log.transferredFrom ? log.transferredFrom.name : 'N/A'}</td>
                  <td>{log.transferredTo ? log.transferredTo.name : 'N/A'}</td>
                  <td>{log.dataCount}</td>
                  <td>{log.transferredBy ? log.transferredBy.name : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransferDataPage;