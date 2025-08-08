// src/pages/ProspectFormPage.js - UPDATED with console.logs for debugging
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import prospectService from '../services/prospectService';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css';
import formStyles from './ProspectFormPage.module.css';

const ProspectFormPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    emailId: '',
    contactNo: '',
    reminderDate: '',
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    // --- DEBUGGING LOG START ---
    console.log("ProspectFormPage: Submitting new prospect with data:", formData);
    // --- DEBUGGING LOG END ---

    try {
      await prospectService.createProspect(formData);
      setSuccessMessage('Prospect added successfully! Redirecting...');
      setFormData({ // Clear form after successful submission
        companyName: '',
        clientName: '',
        emailId: '',
        contactNo: '',
        reminderDate: '',
        comment: '',
      });

      setTimeout(() => {
        navigate('/prospects', { replace: true, state: { refresh: true } });
      }, 1500);

    } catch (err) {
      console.error('ProspectFormPage: Failed to add prospect. Error details:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || err.message || 'Failed to add prospect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={formStyles.pageTitle}>Prospect Form</h1>

      <div className={formStyles.formCard}>
        {loading && <LoadingSpinner />}
        {successMessage && <p className={formStyles.successMessage}>{successMessage}</p>}
        {error && <p className={formStyles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit} className={formStyles.prospectForm}>
          <div className={formStyles.formGroup}>
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={formStyles.formInput}
              required
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="clientName">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={formStyles.formInput}
              required
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="emailId">Email ID</label>
            <input
              type="email"
              id="emailId"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className={formStyles.formInput}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="contactNo">Contact No.</label>
            <input
              type="text"
              id="contactNo"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className={formStyles.formInput}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="reminderDate">Reminder Date</label>
            <input
              type="date"
              id="reminderDate"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
              className={formStyles.formInput}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className={formStyles.formTextarea}
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className={formStyles.submitButton} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProspectFormPage;