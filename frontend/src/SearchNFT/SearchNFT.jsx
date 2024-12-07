// export default SearchNFT;
import React, { useState, useEffect } from 'react';
import styles from './SearchNFT.module.css';
import NFTCard from './NFTCard';
// Import other components if needed
import Footer from './Footer';
import { useSelector } from 'react-redux';
import { formatEther } from 'ethers';
import ipfs from '../ipfs'; // If you still need this

const categories = ['ALL', 'Buildings', 'Sprots', 'Art', 'Music', 'Games', 'Photography'];

function SearchNFT() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const contract = useSelector((state) => state.contract.contract);
  const currentAccount = useSelector((state) => state.wallet.walletInfo);

  const fetchListedTokens = async () => {
    if (!contract) {
      console.warn('Contract is not initialized');
      return;
    }

    try {
      const totalSupply = await contract.totalSupply();
      console.log('Total supply:', totalSupply.toString());
      const tokens = [];

      for (let i = 1; i <= totalSupply; i++) {
        try {
          const listed = await contract.getListedToken(i);
          console.log(`Token ID ${i} is listed:`, listed);
          if (listed.isListed) {
            const tokenId = Number(listed.tokenId);
            const price = formatEther(listed.price);
            let tokenURI = await contract.tokenURI(tokenId);

            // Handle IPFS URI
            const metadataURI = tokenURI;
            const stream = ipfs.cat(metadataURI);
            let data = '';

            for await (const chunk of stream) {
              data += new TextDecoder().decode(chunk);
            }
            const metadata = JSON.parse(data);

            let imageURI;
            if (metadata.image) {
              
              if (/^http(s)?:\/\//.test(metadata.image)) {
                imageURI = metadata.image.replace(
                  /^https?:\/\/ipfs\.io\/ipfs\//,
                  "http://34.72.243.54:8080/ipfs/"
              );
              } else {
                imageURI = `http://34.72.243.54:8080/ipfs/${metadata.image}`;
              }}
            tokens.push({
              tokenId,
              seller: listed.seller,
              price,
              name: metadata.name || `Token #${tokenId}`,
              description: metadata.description || 'No description',
              image: imageURI,
              category: metadata.category || 'Uncategorized',
              items: metadata.items || 1,
              value: price,
            });
          }
        } catch (error) {
          console.error(`Error fetching listed token for Token ID ${i}:`, error);
        }
      }
      // console.log('Tokens:', tokens);


      setCollections(tokens);
      setLoading(false);

      if (tokens.length === 0) {
        console.log('No NFTs are currently listed.');
      }
    } catch (error) {
      console.error('Error fetching listed tokens:', error);
      alert('Failed to fetch listed tokens.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchListedTokens();
    }
  }, [contract]);

  useEffect(() => {
    console.log('Collections updated:', collections);
  }, [collections]);

  return (
    <main className={styles.searchNftContainer}>
      <section className={styles.searchSection}>
        <h1 className={styles.searchTitle}>Search NFT</h1>
        <div className={styles.categoryList}>
          {categories.map((category, index) => (
            <button
              key={index}
              className={activeCategory === category ? styles.activeCategory : styles.category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {loading ? (
          <div>Loading NFTs...</div>
        ) : (
          <div className={styles.nftGrid}>
            {collections
              .filter((nft) => activeCategory === 'ALL' || nft.category === activeCategory)
              .map((nft) => (
                <NFTCard key={nft.tokenId} {...nft} />
              ))}
          </div>
        )}
        {/* <Pagination /> */}
      </section>
      <Footer />
    </main>
  );
}

export default SearchNFT;
