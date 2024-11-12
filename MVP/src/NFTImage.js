// src/NFTImage.js
import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import NFTMarketplaceABI from './NFTMarketplaceABI.json';
import ipfs from './ipfs';

function NFTImage({ tokenId }) {
  const [imageURI, setImageURI] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract('0x345ABB645864755320450984FC60372195EaAE53', NFTMarketplaceABI, provider);
        const tokenURI = await contract.tokenURI(tokenId);
        console.log(`Token URI for Token ID ${tokenId}: ${tokenURI}`);

        // Handle IPFS URI
        const metadataURI = tokenURI;
        console.log(`Fetching metadata from URI: ${metadataURI}`);
        const stream = ipfs.cat(metadataURI);
        let data = '';

        for await (const chunk of stream) {
          data += new TextDecoder().decode(chunk);
        }
        const metadata = JSON.parse(data);

        
        setMetadata(metadata);

        // Handle image URI
        if (metadata.image) {
          const imageURI = `http://34.72.243.54:8080/ipfs/${metadata.image}`;
          setImageURI(imageURI);
          
        }
      } catch (error) {
        console.error(`Error fetching metadata for Token ID ${tokenId}:`, error);
      }
    };

    fetchMetadata();
  }, [tokenId]);

  return (
    <div>
      {imageURI ? (
        <img src={imageURI} alt={`NFT ${tokenId}`} width="200" />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
}

export default NFTImage;