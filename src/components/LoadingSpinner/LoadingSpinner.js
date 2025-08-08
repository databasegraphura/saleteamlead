// src/components/LoadingSpinner/LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css'; // Import its specific CSS

const LoadingSpinner = () => {
  return (
    <div className="spinner-overlay"> {/* Full-screen overlay */}
      <div className="spinner-container"> {/* Container for spinner and text */}
        <div className="loading-spinner"></div> {/* The actual spinning element */}
        <p>Loading...</p> {/* Loading text */}
      </div>
    </div>
  );
};

export default LoadingSpinner;