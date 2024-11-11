import React from 'react';
import styles from './Header.module.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const goPage = (path) => {
    navigate(path);
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>NFT</h2>
      <nav className={styles.navigation}>
        <ul className={styles.navList}>
          <li>
            <Link to="/" className={styles.navLink}>Home</Link>
          </li>
          <li>
            <Link to="/marketplace" className={styles.navLink}>Marketplace</Link>
          </li>
          <li>
            <Link to="/mint" className={styles.navLink}>Minting</Link>
          </li>
          <li>
            <Link to="/ai-artwork" className={styles.navLink}>AI Artwork</Link>
          </li>
          <li>
            <Link to="/user-profile" className={styles.navLink}>User Profile</Link>
          </li>
        </ul>
      </nav>
      <button className={styles.loginButton}>Log in to your account</button>
      <Outlet />
    </header>
  );
};

export default Header;
