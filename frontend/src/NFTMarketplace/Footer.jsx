/**
 * This code was generated by Builder.io.
 */
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h2 className={styles.footerLogo}>NFT</h2>
          <p className={styles.footerTagline}>LOGO</p>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerSectionTitle}>PLAY</h3>
          <ul className={styles.footerList}>
            <li>PLAY & EARN</li>
            <li>MINING</li>
            <li>TELEPORT</li>
            <li>MISSIONS</li>
          </ul>
          <h3 className={styles.footerSectionTitle}>GALACTIC HUBS</h3>
          <ul className={styles.footerList}>
            <li>GRANTS PROGRAM</li>
            <li>MISSION</li>
            <li>APPLICATION LOGIN</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerSectionTitle}>RESOURCES</h3>
          <ul className={styles.footerList}>
            <li>TECHNICAL BLUEPRINT</li>
            <li>DOCUMENTATION</li>
            <li>BINANCE RESEARCH REPORT</li>
            <li>MEDIA KIT</li>
          </ul>
          <h3 className={styles.footerSectionTitle}>LORE</h3>
          <ul className={styles.footerList}>
            <li>TOKENIZED LORE BOOK</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerSectionTitle}>ABOUT</h3>
          <ul className={styles.footerList}>
            <li>STATS</li>
            <li>FAQ & SUPPORT</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3 className={styles.footerSectionTitle}>NEWS</h3>
          <ul className={styles.footerList}>
            <li>BLOG</li>
            <li>ANNOUNCEMENTS</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;