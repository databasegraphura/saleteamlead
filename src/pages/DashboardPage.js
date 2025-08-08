// src/pages/DashboardPage.js - Team Lead Version
import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import reportService from '../services/reportService';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css';
import dashboardStyles from './DashboardPage.module.css'; // Reusing styles from SE DashboardPage

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Backend's getDashboardSummary automatically provides TL-specific data
        const summary = await reportService.getDashboardSummary();
        setDashboardData(summary);
      } catch (err) {
        console.error('Failed to fetch TL dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load Team Lead dashboard.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={`${styles.content} ${dashboardStyles.errorContainer}`}>
        <h2>Error Loading Team Lead Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={styles.content}>
        <h2>Team Lead Dashboard</h2>
        <p>No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={dashboardStyles.pageTitle}>Team Lead Dashboard</h1>

      {/* KPI Cards Section - TL version from screenshot */}
      <div className={dashboardStyles.kpiCards}>
        <div className={dashboardStyles.kpiCard1}>
          <h3>Team Members</h3>
          <p>{dashboardData.teamMembers || 0}</p>
        </div>
        <div className={dashboardStyles.kpiCard2}>
          <h3>Total Call By Team</h3>
          <p>{dashboardData.totalCallByTeam || 0}</p>
        </div>
        <div className={dashboardStyles.kpiCard3}>
          <h3>Total Prospect</h3>
          <p>{dashboardData.totalProspect || 0}</p>
        </div>
        <div className={dashboardStyles.kpiCard4}>
          <h3>Total Client Data</h3>
          <p>{dashboardData.totalClientData || 0}</p>
        </div>
      </div>

      {/* Placeholder for "Total Call" table for TL - This would be a filtered call log list */}
      <div className={dashboardStyles.hotClientsSection}>
        <h2 className={dashboardStyles.sectionTitle}>Today's Call Log (Team)</h2>
        <p>This section will display today's call logs for your team.</p>
        {/* Placeholder table, similar to ReportPage */}
      </div>

    </div>
  );
};

export default DashboardPage;