/**
 * This code was generated by Builder.io.
 */
import React, { useState } from 'react';
import styles from './PopularCollections.module.css';

const PopularCollections = () => {
  const categories = ['ALL', 'Axie', 'Accessory', 'Land', 'Item', 'Rune', 'Charm', 'Material', 'Consumable'];
  const [activeCategory, setActiveCategory] = useState('ALL');

  const collections = [
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c7c6b906f13c410f37641136165451e61f8bd4af0c1deb1f99edc3d195f774b4?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7f832ce42e9c4f9ff10f19af7ff2c93e4f6092bb17ab8d9e8d2525089c37ec96?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/5d3529c6cf9c0a09ed96abb3998dc6643e2946a4a715472a95ba9aeefc7bb302?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1a979e2d9af700800c5622789b9f344d41fcde97624768d62b21e13a66ee5bbf?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/69ec04243bb68057c43bb3be743448e81c6fda42b3edccce6f0b61693ec8795f?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/13e1bc7b7ce5a282992a46483177aae84231197a56bbebf4150603af063b2cfa?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d7483247e91632193f12425d70dcd43ef43ca35498d67f328b331bc5ab58f9a8?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/69886b02c4f618a5237f4ee83c7b94c2df96cc14a5b7917a100aa303d356b294?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e9f4b7f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1f1?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
    { name: 'Baby Wealthy Club', items: 106, value: '$17,625,107', image: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2f2?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c' },
  ];

  return (
    <section className={styles.popularCollections}>
      <h2 className={styles.sectionTitle}>Popular collections</h2>
      <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${category === activeCategory ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={styles.collectionsGrid}>
        {collections.map((collection, index) => (
          <div key={index} className={styles.collectionCard}>
            <img src={collection.image} alt={collection.name} className={styles.collectionImage} />
            <div className={styles.collectionInfo}>
              <h3 className={styles.collectionName}>{collection.name}</h3>
              <p className={styles.collectionItems}>{collection.items} items</p>
              <p className={styles.collectionValue}>{collection.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCollections;