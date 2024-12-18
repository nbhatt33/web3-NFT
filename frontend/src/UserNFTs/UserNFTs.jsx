/**
 * This code was generated by Builder.io.
 */
import React from 'react';
import styles from './UserNFTs.module.css';
import NFTCollection from './NFTCollection';


function UserNFTs() {
  return (
    <main className={styles.userNftsContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.headerSection}>
          <div className={styles.headerContent}>
            <h1 className={styles.headerTitle}>User's NFTs</h1>
          </div>
        </header>
        <NFTCollection />
      </div>
    </main>
  );
}

export default UserNFTs;