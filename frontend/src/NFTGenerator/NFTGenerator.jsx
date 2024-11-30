// import React from 'react';
// import styles from './NFTGenerator.module.css';
// import Header from './Header';
// import InputSection from './InputSection';
// import AdvancedSettings from './AdvancedSettings';

// function NFTGenerator() {
//   const [prompt, setPrompt] = useState('');
//   const [generating, setGenerating] = useState(false);
//   const [generatedImage, setGeneratedImage] = useState(null);
//   const [ipfsHash, setIpfsHash] = useState(null);

//   const generateNFT = async () => {
//     try {
//       setGenerating(true);
      
//       // Call AI service
//       const response = await fetch('http://localhost:8000/generate', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt, credits: 1 })
//       });
      
//       const data = await response.json();
//       setGeneratedImage(`data:image/png;base64,${data.image_base64}`);
//       setIpfsHash(data.ipfs_hash);
      
//       // Create metadata
//       const metadata = {
//         name: `AI Generated NFT #${Date.now()}`,
//         description: prompt,
//         image: `ipfs://${data.ipfs_hash}`,
//         attributes: [{ trait_type: 'AI Generated', value: 'true' }]
//       };
      
//       // Upload metadata to IPFS
//       const metadataHash = await uploadToIPFS(metadata);
      
//       // Mint NFT
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(
//         NFT_MARKETPLACE_ADDRESS,
//         NFT_MARKETPLACE_ABI,
//         signer
//       );
      
//       // Set royalty to 5%
//       const tx = await contract.batchMintNFT([`ipfs://${metadataHash}`], 500);
//       await tx.wait();
      
//       message.success('NFT generated and minted successfully!');
      
//     } catch (error) {
//       message.error('Error generating NFT: ' + error.message);
//     } finally {
//       setGenerating(false);
//     }
//   };


//   return (
//     <main className={styles.container}>
//       <div className={styles.content}>
//         {/* <Header /> */}
//         <div className={styles.textColumn}>
//                 <h1 className={styles.title}>Generate Your NFT with One Click</h1>
//                 {/* <div className={styles.creditsLeft}>10 Credits Left Today</div> */}
//         </div>
//         <div className={styles.imageColumn}>
//             <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d585c1f03f2c05b3b893d42a9e404f4e6cd2eb2940649f7418d52bb02dd67cf?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c" className={styles.headerImage} alt="NFT Generator illustration" />
//         </div>
//         <div className={styles.mainContent}>
//           {/* <InputSection /> */}
//           {/* <AdvancedSettings /> */}

//           <section>
//             <div className={styles.promptSection}>
//                 <label htmlFor="prompt" className={styles.promptLabel}>Prompt</label>
//                 <textarea id="prompt" className={styles.promptInput} placeholder="Text Description of your NFT"
//                           aria-label="Enter prompt for NFT generation"></textarea>
//             </div>
//           </section>
//           <button className={styles.generateButton}>GENERATE</button>
//           <div className={styles.divider}/>
//           <button className={styles.generateButton}>MINT ART WORK</button>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default NFTGenerator; 
import React, { useState } from 'react';
// import { ethers } from 'ethers';
import { formatEther } from 'ethers';
import { toast } from 'react-toastify';
import styles from './NFTGenerator.module.css';
import ipfs from '../ipfs';
import { useSelector } from 'react-redux';

function NFTGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);
  const [metadataHash, setMetadataHash] = useState(null);

  // 新增状态用于自定义名称和分类
  const [nftName, setNftName] = useState('');
  const [categories, setCategories] = useState('');

  const contract = useSelector((state) => state.contract.contract);
  const currentAccount = useSelector((state) => state.wallet.walletInfo);


  // Function to upload metadata to IPFS
  const uploadToIPFS = async (metadata) => {
    const response = await fetch('http://localhost:8000/upload-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metadata),
    });
    const data = await response.json();
    return data.ipfs_hash;
  };

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
      setIpfsHash(data.ipfs_hash);

      toast.info('NFT generated successfully!');
    } catch (error) {
      toast.error('Error generating NFT: ' + error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleMintNFT = async () => {
    if (!ipfsHash || !nftName || !categories) {
      toast.error('Please ensure NFT is generated and all fields are filled.');
      return;
    }

    try {
      // Create metadata with custom name and categories
      const metadata = {
        name: nftName,
        description: prompt,
        image: `ipfs://${ipfsHash}`,
        attributes: [
          { trait_type: 'Category', value: categories },
          { trait_type: 'AI Generated', value: 'true' },
        ],
      };

      // Upload metadata to IPFS
      const uploadedMetadataHash = await uploadToIPFS(metadata);
      setMetadataHash(uploadedMetadataHash);

      // Mint NFT on blockchain
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      // const contract = new ethers.Contract(
      //   NFT_MARKETPLACE_ADDRESS,
      //   NFT_MARKETPLACE_ABI,
      //   signer
      // );


      // Set royalty to 5% (500 basis points)
      const tx = await contract.batchMintNFT([`ipfs://${uploadedMetadataHash}`], 500);
      await tx.wait();

      toast.info('NFT minted successfully!');
    } catch (error) {
      toast.error('Error minting NFT: ' + error.message);
    }
  };

  // const handleMint = async () => {
  //   if (!contract) {
  //     toast.error('Please connect your wallet first.');
  //     return;
  //   }

  //   if (!imageFile) {
  //     toast.error('Please select an image file to upload.');
  //     return;
  //   }

  //   const royaltyAmount = parseInt(mintRoyalty);

  //   if (!royaltyAmount || royaltyAmount < 0 || royaltyAmount > 1000) {
  //     toast.error('Please provide a valid royalty amount in basis points (0-1000).');
  //     return;
  //   }

  //   try {
  //     // Upload Image to IPFS
  //     const addedImage = await ipfs.add(imageFile);
  //     const imageURI = addedImage.path; // Like this: QmW3NgHMb6rssPazmym2VxgaeAg1j48HVWCti1u6UA9AAc
  //     await ipfs.pin.add(imageURI); // No GC
  //     toast.info('Image uploaded to IPFS');
      

  //     // Create Metadata
  //     const metadata = {
  //       name: nftName || `NFT #${Date.now()}`, // user input
  //       description: nftDescription || 'An NFT from NFTMarketplace', // If AI Gen, use AI prompt
  //       image: imageURI,
  //     };

  //     // Upload Metadata to IPFS
  //     const addedMetadata = await ipfs.add(JSON.stringify(metadata));
  //     const metadataURI = addedMetadata.path;
  //     await ipfs.pin.add(metadataURI); // No GC
  //     toast.info('Metadata uploaded to IPFS');
  //     toast.info(metadataURI);
  //     // Mint NFT with Metadata URI
  //     const tx = await contract.batchMintNFT([metadataURI], royaltyAmount);
  //     toast.info('Minting NFT...');
  //     await tx.wait();
  //     toast.success('NFT minted successfully!');



  //     setImageFile(null);
  //     setMintRoyalty('');
  //     setNftName('');
  //     setNftDescription('');
  //     fetchListedTokens();
  //     fetchOwnedTokens(); // Refresh owned NFTs
  //   } catch (error) {
  //     console.error('Minting error:', error);
  //     toast.error('Failed to mint NFT.');
  //   }
  // };

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textColumn}>
          <h1 className={styles.title}>Generate Your NFT with One Click</h1>
        </div>
        <div className={styles.imageColumn}>
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated NFT"
              className={styles.generatedImage}
            />
          ) : (
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d585c1f03f2c05b3b893d42a9e404f4e6cd2eb2940649f7418d52bb02dd67cf?placeholderIfAbsent=true&apiKey=f3aaf6d180294e6db6f355070af6792c"
              className={styles.headerImage}
              alt="NFT Generator illustration"
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
          </section>

          <button
            className={styles.generateButton}
            onClick={handleMintNFT}
            disabled={!ipfsHash || !nftName || !categories}
          >
            MINT ART WORK
          </button>
        </div>
      </div>
    </main>
  );
}

export default NFTGenerator;
