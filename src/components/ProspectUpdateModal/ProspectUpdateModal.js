// src/components/ProspectUpdateModal/ProspectUpdateModal.js
import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal'; // Reusable Modal wrapper
import styles from '../../pages/ReportPage.module.css'; // Reusing ReportPage styles for forms/messages
import formStyles from '../../pages/ProspectFormPage.module.css'; // Reusing ProspectForm styles for inputs

const ProspectUpdateModal = ({ prospect, onClose, onUpdateSuccess, isLoading }) => {
  const [formData, setFormData] = useState({
    activity: '',
    comment: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Initialize form data when prospect prop changes
  useEffect(() => {
    if (prospect) {
      setFormData({
        activity: prospect.activity || '',
        comment: prospect.comment || '',
      });
      setError(null);
      setSuccess('');
    }
  }, [prospect]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    try {
      // Call the onUpdateSuccess prop, which should be the actual API call
      await onUpdateSuccess(prospect._id, formData);
      setSuccess('Prospect updated successfully!');
      // Optionally, you might want to close the modal after a short delay
      // setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update prospect.');
    }
  };

  return (
    <Modal onClose={onClose} title="Update Prospect Details">
      <form onSubmit={handleSubmit} className={styles.modalForm}>
        <div className={styles.formGroup}>
          <label>Company Name</label>
          <input type="text" value={prospect.companyName} disabled className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label>Client Name</label>
          <input type="text" value={prospect.clientName} disabled className={styles.formInput} />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="activity">Activity</label>
          <select
            id="activity"
            name="activity"
            value={formData.activity}
            onChange={handleChange}
            className={styles.formInput}
            required
          >
            <option value="">Select Activity</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Converted">Converted</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Delete Client's Profile">Delete Client's Profile</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="comment">Comment</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            className={styles.formTextarea} // Reusing textarea style
            rows="3"
          ></textarea>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </Modal>
  );
};

export default ProspectUpdateModal;