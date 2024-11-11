import React, { useState } from 'react';
import { ethers } from 'ethers';
import { message } from 'antd';
import styles from './NFTGenerator.module.css';
import { NFT_MARKETPLACE_ABI, NFT_MARKETPLACE_ADDRESS } from '../constants';

function NFTGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);

  const generateNFT = async () => {
    try {
      setGenerating(true);
      
      // Call AI service
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, credits: 1 })
      });
      
      const data = await response.json();
      setGeneratedImage(`data:image/png;base64,${data.image_base64}`);
      setIpfsHash(data.ipfs_hash);
      
      // Create metadata
      const metadata = {
        name: `AI Generated NFT #${Date.now()}`,
        description: prompt,
        image: `ipfs://${data.ipfs_hash}`,
        attributes: [{ trait_type: 'AI Generated', value: 'true' }]
      };
      
      // Upload metadata to IPFS
      const metadataHash = await uploadToIPFS(metadata);
      
      // Mint NFT
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFT_MARKETPLACE_ADDRESS,
        NFT_MARKETPLACE_ABI,
        signer
      );
      
      // Set royalty to 5%
      const tx = await contract.batchMintNFT([`ipfs://${metadataHash}`], 500);
      await tx.wait();
      
      message.success('NFT generated and minted successfully!');
      
    } catch (error) {
      message.error('Error generating NFT: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1>AI NFT Generator</h1>
        
        <div className={styles.promptSection}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your NFT..."
            className={styles.promptInput}
          />
        </div>

        {generatedImage && (
          <div className={styles.previewSection}>
            <img src={generatedImage} alt="Generated NFT" />
          </div>
        )}

        <button 
          onClick={generateNFT} 
          disabled={generating || !prompt}
          className={styles.generateButton}
        >
          {generating ? 'Generating...' : 'Generate & Mint NFT'}
        </button>
      </div>
    </main>
  );
}

export default NFTGenerator; 