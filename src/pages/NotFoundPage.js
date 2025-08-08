// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Used to navigate back to a known route
import styles from '../components/Layout/Layout.module.css'; // Reusing layout styles for basic page centering/styling

const NotFoundPage = () => {
  return (
    <div className={styles.content} style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      {/* Link back to a relevant page, typically the dashboard */}
      <Link to="/dashboard" className={styles.navButton}>Go to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;