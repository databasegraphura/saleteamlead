// src/pages/TotalSalesPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate to Prospect Form for "Add New"
import salesService from '../services/salesService'; // Our sales service
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import tableStyles from './ReportPage.module.css'; // Reusing report table styles for consistency

const TotalSalesPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError(null);
        // The backend's getAllSales API automatically filters by the logged-in Team Lead's team
        const data = await salesService.getAllSales();
        setSalesData(data);
      } catch (err) {
        console.error('Failed to fetch team sales data:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred while fetching team sales.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const handleAddNewClick = () => {
    navigate('/prospect-form'); // Navigate to the Prospect Form page for adding new leads
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={`${styles.content} ${tableStyles.errorContainer}`}>
        <h2>Error Loading Total Sales</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={tableStyles.pageTitle}>Total Sales (Team)</h1>

      <div className={tableStyles.reportSection}>
        <div className={tableStyles.sectionHeader}> {/* Custom header for button alignment */}
          <h2 className={tableStyles.sectionTitle}>Sales Records for Your Team</h2>
          <button onClick={handleAddNewClick} className={tableStyles.searchButton}>Add New</button> {/* Reusing searchButton for styling */}
        </div>
        
        {salesData.length === 0 && !loading ? (
          <p>No sales records found for your team.</p>
        ) : (
          <table className={tableStyles.reportTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Contact No.</th>
                <th>Services</th>
                <th>Amount</th>
                <th>Sales Executive</th> {/* Display Sales Executive name for TL */}
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.companyName}</td>
                  <td>{sale.clientName}</td>
                  <td>{sale.emailId || 'N/A'}</td>
                  <td>{sale.contactNo || 'N/A'}</td>
                  <td>{sale.services || 'N/A'}</td>
                  <td>Rs. {sale.amount ? sale.amount.toFixed(2) : '0.00'}</td>
                  <td>{sale.salesExecutive ? sale.salesExecutive.name : 'N/A'}</td> {/* Display SE name */}
                  <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TotalSalesPage;