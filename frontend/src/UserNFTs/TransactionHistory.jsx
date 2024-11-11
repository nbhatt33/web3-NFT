/**
 * This code was generated by Builder.io.
 */
import React from 'react';
import styles from './UserNFTs.module.css';

const transactions = [
  { id: 1, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bddf9d3bed1fa7202a1ada0f03abf6d8b9a6a899d898c0d530ba26153c27770b?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c", name: "Baby Wealthy Club", price: "$17,625,107", time: "2024.09.12 14:32:12" },
  { id: 2, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bddf9d3bed1fa7202a1ada0f03abf6d8b9a6a899d898c0d530ba26153c27770b?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c", name: "Baby Wealthy Club", price: "$17,625,107", time: "2024.09.12 14:32:12" },
  { id: 3, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bddf9d3bed1fa7202a1ada0f03abf6d8b9a6a899d898c0d530ba26153c27770b?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c", name: "Baby Wealthy Club", price: "$17,625,107", time: "2024.09.12 14:32:12" },
  { id: 4, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bddf9d3bed1fa7202a1ada0f03abf6d8b9a6a899d898c0d530ba26153c27770b?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c", name: "Baby Wealthy Club", price: "$17,625,107", time: "2024.09.12 14:32:12" },
  { id: 5, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bddf9d3bed1fa7202a1ada0f03abf6d8b9a6a899d898c0d530ba26153c27770b?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c", name: "Baby Wealthy Club", price: "$17,625,107", time: "2024.09.12 14:32:12" },
  { id: 6, image: "https://cdn.builder.io/api/v1/image/assets/TEMP/bddf9d3bed1fa7202a1ada0f03abf6d8b9a6a899d898c0d530ba26153c27770b?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c", name: "Baby Wealthy Club", price: "$17,625,107", time: "2024.09.12 14:32:12" },
];

function TransactionHistory() {
  return (
    <section className={styles.transactionHistorySection}>
      <div className={styles.transactionHeader}>
        <h2 className={styles.transactionTitle}>Transaction history</h2>
        <div className={styles.transactionTypes}>
          <button className={styles.activeType}>Purchase</button>
          <button className={styles.inactiveType}>Sell</button>
        </div>
      </div>
      <div className={styles.transactionGrid}>
        {transactions.map((transaction) => (
          <article key={transaction.id} className={styles.transactionCard}>
            <img src={transaction.image} alt={transaction.name} className={styles.transactionImage} />
            <div className={styles.transactionDetails}>
              <h3 className={styles.transactionName}>{transaction.name}</h3>
              <p className={styles.transactionPrice}>{transaction.price}</p>
              <div className={styles.transactionMeta}>
                <p className={styles.transactionTime}>Time of purchase: {transaction.time}</p>
                <span className={styles.transactionId}>106</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TransactionHistory;