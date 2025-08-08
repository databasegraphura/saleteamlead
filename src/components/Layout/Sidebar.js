// src/components/Layout/Sidebar.js - MODIFIED FOR TEAM LEAD (CLEAN VERSION)
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Layout.module.css';
import useAuth from '../../hooks/useAuth';

// ✅ Import ALL needed icons at once
import {
  FaTachometerAlt,
  FaUserCheck,
  FaChartLine,
  FaClipboardList,
  FaUsers,
  FaExchangeAlt,
  FaBan,
  FaWpforms
} from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();

  // ✅ Navigation items with icons directly stored
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaTachometerAlt /> },
    { name: 'Total Sales', path: '/total-sales', icon: <FaChartLine /> },
    { name: 'Total Prospect', path: '/prospects', icon: <FaUserCheck /> },
    { name: 'Report', path: '/report', icon: <FaClipboardList /> },
    { name: 'Team Member', path: '/team-member', icon: <FaUsers /> },
    { name: 'Transfer Data', path: '/transfer-data', icon: <FaExchangeAlt /> },
    { name: 'Untouched Data', path: '/untouched-data', icon: <FaBan /> },
    { name: 'Prospect Form', path: '/prospect-form', icon: <FaWpforms /> },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Logo + User Info */}
      <div className={styles.logoSection}>
        <img src='logo.png' alt="Graphura Logo" className={styles.logo} />
        <div className={styles.userInfo}>
          <div className={styles.userIcon}>👤</div>
          <span className={styles.userNameSidebar}>
            {user ? user.name : 'Name'}
          </span>
          <span className={styles.userRole}>
            {user
              ? user.role
                .replace('_', ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
              : 'Role'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navbarNav}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? `${styles.navItem} ${styles.activeNavItem}`
                : styles.navItem
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
