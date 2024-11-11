/**
 * This code was generated by Builder.io.
 */
import React from 'react';
import styles from './NFTMarketplace.module.css';

const NavItem = ({ text, isActive }) => {
  return (
    <li className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}>
      {text}
    </li>
  );
};

export default NavItem;