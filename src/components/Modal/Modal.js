// src/components/Modal/Modal.js
import React from 'react';
import ReactDOM from 'react-dom'; // Required for React Portals
import styles from './Modal.module.css'; // Import CSS module for styling

// Backdrop component: The semi-transparent overlay behind the modal
const Backdrop = ({ onClose }) => {
  return <div className={styles.backdrop} onClick={onClose} />;
};

// ModalOverlay component: The actual modal content container
const ModalOverlay = ({ children, title, onClose }) => {
  return (
    <div className={styles.modal}>
      <header className={styles.modalHeader}>
        <h2>{title}</h2>
        <button onClick={onClose} className={styles.closeButton}>&times;</button> {/* Close button */}
      </header>
      <div className={styles.modalContent}>{children}</div> {/* Children represent the content inside the modal */}
    </div>
  );
};

// Main Modal component: Uses React Portals to render Backdrop and ModalOverlay
const Modal = ({ children, title, onClose }) => {
  // Ensure the portal roots exist in public/index.html
  const backdropRoot = document.getElementById('backdrop-root');
  const overlayRoot = document.getElementById('overlay-root');

  if (!backdropRoot || !overlayRoot) {
    console.error("Modal portal roots not found. Please add <div id='backdrop-root'></div> and <div id='overlay-root'></div> to public/index.html");
    return null; // Or throw an error, or render a fallback
  }

  return (
    <>
      {ReactDOM.createPortal(<Backdrop onClose={onClose} />, backdropRoot)}
      {ReactDOM.createPortal(
        <ModalOverlay title={title} onClose={onClose}>{children}</ModalOverlay>,
        overlayRoot
      )}
    </>
  );
};

export default Modal;