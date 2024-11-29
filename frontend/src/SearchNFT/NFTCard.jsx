/**
 * This code was generated by Builder.io.
 */
import React from 'react';
import styles from './NFTCard.module.css';

function NFTCard({ name, price, image }) {
  return (
    <article className={styles.nftCard}>
      <img src={image} alt={`NFT: ${name}`} className={styles.nftImage} />
      <div className={styles.nftInfo}>
        <h2 className={styles.nftName}>{name}</h2>
        {/* <span className={styles.nftPrice}>106</span> */}
      </div>
      <p className={styles.nftValue}>Price: {price} ETH</p>
    </article>
  );
}

export default NFTCard;