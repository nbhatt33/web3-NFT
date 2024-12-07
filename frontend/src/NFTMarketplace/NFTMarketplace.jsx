/**
 * This code was generated by Builder.io.
 */
import React from 'react';
import PopularCollections from './PopularCollections';
import Footer from './Footer';
import styles from './NFTMarketplace.module.css';

const NFTMarketplace = () => {
  return (
    <div className={styles.marketplaceContainer}>
      {/* <img src="/background.png" alt="ss" className={styles.backgroundImage} /> */}
      <div className={styles.contentWrapper}>
        {/* <Header /> */}
        <h1 className={styles.mainTitle}>NFT Marketplace for Digital Art</h1>
        <button className={styles.ctaButton}>See more</button>
      </div>
      <main className={styles.mainContent}>
        {/* <TradeIndices /> */}
        <PopularCollections />
      </main>
      <Footer />
    </div>
  );
};

export default NFTMarketplace;