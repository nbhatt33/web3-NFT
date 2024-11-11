import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logoSection}>
          <h2 className={styles.logo}>NFT</h2>
          <p className={styles.logoSubtext}>LOGO</p>
        </div>
        <nav className={styles.footerNav}>
          <div className={styles.navColumn}>
            <h3>PLAY</h3>
            <ul>
              <li>PLAY & EARN</li>
              <li>MINING</li>
              <li>TELEPORT</li>
              <li>MISSIONS</li>
            </ul>
            <h3>GALACTIC HUBS</h3>
            <ul>
              <li>GRANTS PROGRAM</li>
              <li>MISSION</li>
              <li>APPLICATION LOGIN</li>
            </ul>
          </div>
          <div className={styles.navColumn}>
            <h3>RESOURCES</h3>
            <ul>
              <li>TECHNICAL BLUEPRINT</li>
              <li>DOCUMENTATION</li>
              <li>BINANCE RESEARCH REPORT</li>
              <li>MEDIA KIT</li>
            </ul>
            <h3>LORE</h3>
            <ul>
              <li>TOKENIZED LORE BOOK</li>
            </ul>
          </div>
          <div className={styles.navColumn}>
            <h3>ABOUT</h3>
            <ul>
              <li>STATS</li>
              <li>FAQ & SUPPORT</li>
            </ul>
          </div>
          <div className={styles.navColumn}>
            <h3>NEWS</h3>
            <ul>
              <li>BLOG</li>
              <li>MINING</li>
              <li>ANNOUNCEMENTS</li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;