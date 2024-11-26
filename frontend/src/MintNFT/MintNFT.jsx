/**
 * This code was generated by Builder.io.
 */
import React from "react";
import styles from './MintNFT.module.css';
import CollectionSelector from './CollectionSelector';
import InputField from './InputField';
import TagsInput from './TagsInput';

function MintNFT() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.imageColumn}>
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/17f68c3213fa2411c110bfedaa98b009fa71d9e0937ed6e87f988eb4619abb86?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c" className={styles.headerImage} alt="NFT artwork example" />
            </div>
            <div className={styles.textColumn}>
              <h1 className={styles.title}>Mint your art to NFT</h1>
            </div>
          </div>
        </header>

        <section className={styles.uploadSection}>
          <h2 className={styles.uploadTitle}>Upload Your Artwork</h2>
          <div className={styles.uploadArea} role="button" tabIndex="0">
            Drop here or select a file to upload
          </div>
        </section>

        <form className={styles.formSection}>
          <CollectionSelector />

          <InputField
            label="Name your NFT"
            className={styles.nameInput}
          />

          <InputField
            label="Add Some Description"
            className={styles.descriptionInput}
          />

          <TagsInput />

          <button type="submit" className={styles.mintButton}>MINT</button>
        </form>
      </div>
    </main>
  );
}

export default MintNFT;
