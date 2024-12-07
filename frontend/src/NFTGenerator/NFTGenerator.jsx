import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './NFTGenerator.module.css';
import ipfs from '../ipfs';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';





function NFTGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generatedFile, setGeneratedFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [metadataHash, setMetadataHash] = useState(null);
  const [mintRoyalty, setMintRoyalty] = useState(0);


  const [nftName, setNftName] = useState('');
  const [categories, setCategories] = useState('');
  const [file, setFile] = useState(null);
  

  const contract = useSelector((state) => state.contract.contract);
  const currentAccount = useSelector((state) => state.wallet.walletInfo);

  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    
  
    const reader = new FileReader();
    reader.onload = (e) => {
      setGeneratedImage(e.target.result); 
    };
    reader.readAsDataURL(uploadedFile);
  
    const fileStream = uploadedFile.stream(); 
    setGeneratedFile(fileStream);
    // processFileStream(fileStream); 
  };
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*', 
    maxFiles: 1, 
  });


function base64ToFile(base64Data, filename, contentType) {
  const byteString = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new File([uint8Array], filename, { type: contentType });
}

  const handleGenerateNFT = async () => {
    try {
      setGenerating(true);

      // Call AI service to generate image
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, credits: 1 }),
      });
      const data = await response.json();
      setGeneratedImage(`data:image/png;base64,${data.image_base64}`);
      const imageFile = base64ToFile(data.image_base64, 'generated_image.png', 'image/png');
      setGeneratedFile(imageFile);
  

      // setIpfsHash(data.ipfs_hash);

      toast.info('NFT generated successfully!');
    } catch (error) {
      toast.error('Error generating NFT: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };


  const handleMintNFT = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (!generatedImage) {
      console.log(generatedImage);
      toast.error('Please select an image file to upload.');
      return;
    }

    // const royaltyAmount = parseInt(mintRoyalty);
    const royaltyAmount = parseInt(mintRoyalty);
    console.log(royaltyAmount);

    if (!royaltyAmount || royaltyAmount < 0 || royaltyAmount > 1000) {
      toast.error('Please provide a valid royalty amount in basis points (0-1000).');
      return;
    }

    try {
      // Upload Image to IPFS
      const addedImage = await ipfs.add(generatedFile);
      const imageURI = addedImage.path; // Like this: QmW3NgHMb6rssPazmym2VxgaeAg1j48HVWCti1u6UA9AAc
      await ipfs.pin.add(imageURI); // No GC
      toast.info('Image uploaded to IPFS');
      

      // Create Metadata
      const metadata = {
        name: nftName || `NFT #${Date.now()}`, // user input
        description: prompt || 'An NFT from NFTMarketplace', // If AI Gen, use AI prompt
        // image: imageURI,
        image: `https://ipfs.io/ipfs/${imageURI}`,
        categories: categories || 'Uncategorized', // user input
      };

      // Upload Metadata to IPFS
      const addedMetadata = await ipfs.add(JSON.stringify(metadata));
      const metadataURI = addedMetadata.path;
      await ipfs.pin.add(metadataURI); // No GC
      toast.info('Metadata uploaded to IPFS');
      toast.info(metadataURI);
      // Mint NFT with Metadata URI
      const tx = await contract.batchMintNFT([metadataURI], royaltyAmount);
      toast.info('Minting NFT...');
      await tx.wait();
      toast.success('NFT minted successfully!');

    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint NFT.');
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textColumn}>
          <h1 className={styles.title}>Generate Your NFT with One Click</h1>
        </div>
        <div 
          {...getRootProps()} 
          className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}
        >
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated NFT"
              className={styles.headerImage}
            />
          ) : (
            <img
              src='/img.png'
              alt="Generated NFT"
              className={styles.dropheaderImage}
            />
          )}
        </div>
        <div className={styles.mainContent}>
          <section>
            <div className={styles.promptSection}>
              <label htmlFor="prompt" className={styles.promptLabel}>
                Prompt
              </label>
              <textarea
                id="prompt"
                className={styles.promptInput}
                placeholder="Text Description of your NFT"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                aria-label="Enter prompt for NFT generation"
              />
            </div>
          </section>
          <button
            className={styles.generateButton}
            onClick={handleGenerateNFT}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'GENERATE'}
          </button>

          <div className={styles.divider} />

          {/* Custom Name and Categories Section */}
          <section className={styles.metadataSection}>
            <div>
              <label htmlFor="nftName" className={styles.metaLabel}>
                NFT Name
              </label>
              <input
                id="nftName"
                className={styles.input}
                type="text"
                placeholder="Enter NFT Name"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="categories" className={styles.metaLabel}>
                Categories
              </label>
              <input
                id="categories"
                className={styles.input}
                type="text"
                placeholder="Enter Categories"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mintRoyalty" className={styles.metaLabel}>
              mintRoyalty
              </label>
              <input
                id="mintRoyalty"
                className={styles.input}
                type="text"
                placeholder="Enter mintRoyalty"
                value={mintRoyalty}
                onChange={(e) => setMintRoyalty(e.target.value)}
              />
            </div>

          </section>

          <button
            className={styles.generateButton}
            onClick={handleMintNFT}
            disabled={!nftName || !categories}
          >
            MINT ART WORK
          </button>
        </div>
      </div>
    </main>
  );
}

export default NFTGenerator;
