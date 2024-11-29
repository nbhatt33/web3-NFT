
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './PopularCollections.module.css';
import { BrowserProvider, Contract, formatEther } from 'ethers';
import NFTMarketplaceABI from '../NFTMarketplaceABI.json'; 
import ContractAddress from '../ContractAddress.json';
import ipfs from '../ipfs';
import { setMarketContract } from '../redux/features/contractSlice';

const PopularCollections = () => {
  
  const dispatch = useDispatch();
  const categories = ['ALL', 'Axie', 'Accessory', 'Land', 'Item', 'Rune', 'Charm', 'Material', 'Consumable'];
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);

  const contractAddress = ContractAddress.address; 

  // 初始化合约实例
  useEffect(() => {
    const initializeContract = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const tempProvider = new BrowserProvider(window.ethereum);
          const tempSigner = await tempProvider.getSigner();
          const tempContract = new Contract(contractAddress, NFTMarketplaceABI, tempSigner);
          setContract(tempContract);
          dispatch(setMarketContract(tempContract));
          console.log('Contract initialized:', tempContract);
        } catch (error) {
          console.error('Error initializing contract:', error);
          alert('Failed to initialize contract.');
        }
      } else {
        alert('Please install MetaMask to use this feature.');
      }
    };

    initializeContract();
  }, [contractAddress]);

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
          // console.log("Token ID:", listed.tokenId, "Type:", typeof listed.tokenId);
          // if (listed.isListed) {
          if (1) {
            const tokenId = Number(listed.tokenId);
            const price = formatEther(listed.price);
            let tokenURI = await contract.tokenURI(tokenId);
            // console.log(`Token URI for Token ID ${tokenId}: ${tokenURI}`);

            // Handle IPFS URI
            const metadataURI = tokenURI;
            // console.log(`Fetching metadata from URI: ${metadataURI}`);
            const stream = ipfs.cat(metadataURI);
            let data = '';

            for await (const chunk of stream) {
              data += new TextDecoder().decode(chunk);
            }
            const metadata = JSON.parse(data);
            // console.log('Metadata:', metadata);
            const imageURI = `http://34.72.243.54:8080/ipfs/${metadata.image}`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);


  const filteredCollections = collections.filter((collection) =>
    activeCategory === 'ALL' ? true : collection.category === activeCategory
  );

  return (
    <section className={styles.popularCollections}>
      <h2 className={styles.sectionTitle}>Popular Collections</h2>
      {/* <div className={styles.categoryFilter}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.filterButton} ${category === activeCategory ? styles.active : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div> */}
      {loading ? (
        <p>Loading collections...</p>
      ) : (
        <div className={styles.collectionsGrid}>
          {filteredCollections.length === 0 ? (
            <p>No collections available for this category.</p>
          ) : (
            filteredCollections.map((collection, index) => (
              <div key={index} className={styles.collectionCard}>
                <Link to={`/pay/${collection.tokenId}`} state={{ collection }} className={styles.collectionLink}>
                  <img src={collection.image} alt={collection.name} className={styles.collectionImage} />
                  <div className={styles.collectionInfo}>
                    <h3 className={styles.collectionName}>{collection.name}</h3>
                    {/* <p className={styles.collectionItems}>Token ID: {collection.tokenId}</p> */}
                    <p className={styles.collectionValue}>Price: {collection.price} ETH</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default PopularCollections;
