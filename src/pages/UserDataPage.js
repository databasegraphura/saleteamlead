// src/pages/UserDataPage.js - For Team Lead (My Profile)
import React, { useEffect, useState } from 'react';
import userService from '../services/userService'; // Our user service
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import pageStyles from './UserDataPage.module.css'; // Specific styles for this page (copy from SE frontend)

const UserDataPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '', // Email might not be editable, but display it
    contactNo: '',
    location: '',
  });
  const [updateMessage, setUpdateMessage] = useState('');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getMe(); // Backend filters to current user automatically
        setUserData(data);
        // Initialize form data with fetched user data
        setEditFormData({
          name: data.name || '',
          email: data.email || '',
          contactNo: data.contactNo || '',
          location: data.location || '',
        });
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs only once on mount

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateMessage('');

    try {
      // Only send fields that the user is allowed to update (name, contactNo, location for self)
      const updatePayload = {
        name: editFormData.name,
        contactNo: editFormData.contactNo,
        location: editFormData.location,
      };
      // Email is usually not updatable via this route, so we exclude it from payload

      const updatedUser = await userService.updateMe(updatePayload); // Backend handles update for current user
      setUserData(updatedUser);
      setIsEditing(false); // Exit editing mode
      setUpdateMessage('Profile updated successfully!');
    } /* // This `catch` block is from the previous response. It was within the `AuthPage.js` 
    // `handleAuthSubmit` function. It seems like it was accidentally copied into `UserDataPage.js`. 
    // The previous `UserDataPage.js` did not have this `catch` block in `handleUpdateSubmit`.
    // Please ensure you are copying the correct `UserDataPage.js` from the SE frontend, or fix this if it's new.
    */
    catch (err) {
      console.error('Failed to update user data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile.');
      setUpdateMessage('');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={`${styles.content} ${pageStyles.errorContainer}`}>
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={styles.content}>
        <h2>My Profile</h2>
        <p>No user data available.</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={pageStyles.pageTitle}>My Profile</h1>

      {updateMessage && <p className={pageStyles.successMessage}>{updateMessage}</p>}

      <div className={pageStyles.profileCard}>
        {!isEditing ? (
          <>
            <div className={pageStyles.profileDetail}>
              <strong>Name:</strong> <span>{userData.name}</span>
            </div>
            <div className={pageStyles.profileDetail}>
              <strong>Email:</strong> <span>{userData.email}</span>
            </div>
            <div className={pageStyles.profileDetail}>
              <strong>Role:</strong> <span>{userData.role}</span>
            </div>
            {userData.contactNo && (
              <div className={pageStyles.profileDetail}>
                <strong>Contact No:</strong> <span>{userData.contactNo}</span>
              </div>
            )}
            {userData.location && (
              <div className={pageStyles.profileDetail}>
                <strong>Location:</strong> <span>{userData.location}</span>
              </div>
            )}
            {userData.joiningDate && (
              <div className={pageStyles.profileDetail}>
                <strong>Joining Date:</strong> <span>{new Date(userData.joiningDate).toLocaleDateString()}</span>
              </div>
            )}
            <button onClick={() => setIsEditing(true)} className={pageStyles.editButton}>Edit Profile</button>
          </>
        ) : (
          <form onSubmit={handleUpdateSubmit} className={pageStyles.editForm}>
            <div className={pageStyles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                className={pageStyles.formInput}
                required
              />
            </div>
            <div className={pageStyles.formGroup}>
              <label htmlFor="email">Email (Not Editable)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editFormData.email}
                className={pageStyles.formInput}
                disabled // Email is typically not editable
              />
            </div>
            <div className={pageStyles.formGroup}>
              <label htmlFor="contactNo">Contact No.</label>
              <input
                type="text"
                id="contactNo"
                name="contactNo"
                value={editFormData.contactNo}
                onChange={handleEditChange}
                className={pageStyles.formInput}
              />
            </div>
            <div className={pageStyles.formGroup}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={editFormData.location}
                onChange={handleEditChange}
                className={pageStyles.formInput}
              />
            </div>
            <div className={pageStyles.formActions}>
              <button type="submit" className={pageStyles.saveButton} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className={pageStyles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserDataPage;