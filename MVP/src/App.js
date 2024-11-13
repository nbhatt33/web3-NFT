// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers';
import NFTMarketplaceABI from './NFTMarketplaceABI.json';
import ContractAddress from './ContractAddress.json';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ipfs from './ipfs'; // Ensure this points to your IPFS client
import NFTImage from './NFTImage'; // Import the NFTImage component


function App() {
  // State variables
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contractAddress, setContractAddress] = useState(ContractAddress.address);

  // Minting states
  const [imageFile, setImageFile] = useState(null);
  const [mintRoyalty, setMintRoyalty] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');

  // User owned tokens
  const [ownedTokens, setOwnedTokens] = useState([]);

  // Privately Transfer Token (unlisted token)
  const [transferTokenId, setTransferTokenId] = useState('');
  const [transferToAddress, setTransferToAddress] = useState('');
  const [confirmToAddress, setConfirmToAddress] = useState('');


  // Listing states
  const [listTokenId, setListTokenId] = useState('');
  const [listPrice, setListPrice] = useState('');

  // Unlisting states
  const [unlistTokenId, setUnlistTokenId] = useState('');

  // Purchasing states
  const [purchaseTokenId, setPurchaseTokenId] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  // Marketplace Fee states
  const [newFee, setNewFee] = useState('');

  // Listed Tokens
  const [listedTokens, setListedTokens] = useState([]);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const tempProvider = new BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new Contract(contractAddress, NFTMarketplaceABI, tempSigner);

        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setCurrentAccount(accounts[0]);

        toast.success('Wallet connected successfully!');
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };
    checkIfWalletIsConnected();
    // eslint-disable-next-line
  }, []);

  // Handle Mint NFTs with Image Upload
  const handleMint = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (!imageFile) {
      toast.error('Please select an image file to upload.');
      return;
    }

    const royaltyAmount = parseInt(mintRoyalty);

    if (!royaltyAmount || royaltyAmount < 0 || royaltyAmount > 1000) {
      toast.error('Please provide a valid royalty amount in basis points (0-1000).');
      return;
    }

    try {
      // Upload Image to IPFS
      const addedImage = await ipfs.add(imageFile);
      const imageURI = addedImage.path; // Like this: QmW3NgHMb6rssPazmym2VxgaeAg1j48HVWCti1u6UA9AAc
      await ipfs.pin.add(imageURI); // No GC
      toast.info('Image uploaded to IPFS');
      

      // Create Metadata
      const metadata = {
        name: nftName || `NFT #${Date.now()}`, // user input
        description: nftDescription || 'An NFT from NFTMarketplace', // If AI Gen, use AI prompt
        image: imageURI,
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



      setImageFile(null);
      setMintRoyalty('');
      setNftName('');
      setNftDescription('');
      fetchListedTokens();
      fetchOwnedTokens(); // Refresh owned NFTs
    } catch (error) {
      console.error('Minting error:', error);
      toast.error('Failed to mint NFT.');
    }
  };


  // Handle List NFT
  const handleList = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (!listTokenId || !listPrice) {
      toast.error('Please provide valid token ID and price.');
      return;
    }
    const tokenId = parseInt(listTokenId);
    const price = parseEther(listPrice);


    try {
      const tx = await contract.listToken(tokenId, price);
      toast.info(`Listing Token ID ${tokenId}...`);
      await tx.wait();
      toast.success(`Token ID ${tokenId} listed for ${listPrice} ETH`);
      setListTokenId('');
      setListPrice('');
      fetchListedTokens();
      fetchOwnedTokens(); // Refresh owned NFTs
    } catch (error) {
      console.error('Listing error:', error);
      toast.error('Failed to list NFT.');
    }
  };

  // Handle Unlist NFT
  const handleUnlist = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    const tokenId = parseInt(unlistTokenId);

    if (!tokenId) {
      toast.error('Please provide a valid token ID.');
      return;
    }

    try {
      const tx = await contract.unlistToken(tokenId);
      toast.info(`Unlisting Token ID ${tokenId}...`);
      await tx.wait();
      toast.success(`Token ID ${tokenId} unlisted successfully`);
      setUnlistTokenId('');
      fetchListedTokens();
      fetchOwnedTokens(); // Refresh owned NFTs
    } catch (error) {
      console.error('Unlisting error:', error);
      toast.error('Failed to unlist NFT.');
    }
  };

  // Handle Purchase NFT
  const handlePurchase = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    const tokenId = parseInt(purchaseTokenId);
    const price = parseEther(purchasePrice);

    if (!tokenId || !price) {
      toast.error('Please provide valid token ID and price.');
      return;
    }

    try {
      const tx = await contract.purchaseToken(tokenId, { value: price });
      toast.info(`Purchasing Token ID ${tokenId}...`);
      await tx.wait();
      toast.success(`Purchased Token ID ${tokenId} for ${purchasePrice} ETH`);
      setPurchaseTokenId('');
      setPurchasePrice('');
      fetchListedTokens();
      fetchOwnedTokens(); // Refresh owned NFTs
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase NFT.');
    }
  };

  // Handle Set Marketplace Fee (Owner Only)
  const handleSetFee = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    const fee = parseInt(newFee);

    if (isNaN(fee) || fee < 0 || fee > 1000) {
      toast.error('Please provide a valid fee in basis points (0-1000).');
      return;
    }

    try {
      const tx = await contract.setMarketplaceFee(fee);
      toast.info(`Setting marketplace fee to ${fee / 100}%...`);
      await tx.wait();
      toast.success(`Marketplace fee set to ${fee / 100}%`);
      setNewFee('');
    } catch (error) {
      console.error('Set fee error:', error);
      toast.error('Failed to set marketplace fee.');
    }
  };

  // Handle Pause Contract (Owner Only)
  const handlePause = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    try {
      const tx = await contract.pause();
      toast.info('Pausing contract...');
      await tx.wait();
      toast.success('Contract paused.');
    } catch (error) {
      console.error('Pause error:', error);
      toast.error('Failed to pause contract.');
    }
  };

  // Handle Unpause Contract (Owner Only)
  const handleUnpause = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    try {
      const tx = await contract.unpause();
      toast.info('Unpausing contract...');
      await tx.wait();
      toast.success('Contract unpaused.');
    } catch (error) {
      console.error('Unpause error:', error);
      toast.error('Failed to unpause contract.');
    }
  };

  // Fetch Listed Tokens
  const fetchListedTokens = async () => {
    if (!contract) {
      console.warn('Contract is not initialized');
      return;
    }

    try {
      const total = await contract.totalSupply();
      console.log("Total supply:", total.toString());
      const tokens = [];

      for (let i = 1; i <= total; i++) {
        try {
          const listed = await contract.getListedToken(i);
          // console.log("Token ID:", listed.tokenId, "Type:", typeof listed.tokenId);
          if (listed.isListed) {
            tokens.push({
              tokenId: parseInt(listed.tokenId), // Token ID: 1n Type: bigint, later will change, overflow
              seller: listed.seller,
              price: formatEther(listed.price),
            });
          }
        } catch (error) {
          console.error(`Error fetching listed token for Token ID ${i}:`, error);
        }
      }

      setListedTokens(tokens);
      if (tokens.length === 0) {
        toast.info('No NFTs are currently listed.');
      }
    } catch (error) {
      console.error('Error fetching listed tokens:', error);
      toast.error('Failed to fetch listed tokens.');
    }
  };

    // Fetch User Owned Tokens
    const fetchOwnedTokens = async () => {
      if (!contract) {
        toast.error('Please connect your wallet first.');
        return;
      }
  
      if (!currentAccount) {
        toast.error('Please connect your account first.');
        return;
      }
  
      try {
        const balance = await contract.balanceOf(currentAccount);
        const tokens = [];
  
        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(currentAccount, i);
          tokens.push(parseInt(tokenId));
        }
  
        setOwnedTokens(tokens);
        if (tokens.length === 0) {
          toast.info('You don\'t have any NFTs.');
        }
      } catch (error) {
        console.error('Error fetching your owned tokens:', error);
        toast.error('Failed to fetch owned tokens.');
      }
    };

  // Fetch listed tokens on contract change
  useEffect(() => {
    fetchListedTokens();
    // eslint-disable-next-line
  }, [contract]);

  // Fetch owned tokens on account or contract change
  useEffect(() => {
    if (contract && currentAccount) {
      fetchOwnedTokens();
    }
    // eslint-disable-next-line
  }, [contract, currentAccount]);

  // Handle Account and Network Changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      // return () => {}; TODO: Cleanup
    }
  }, []);

  // Private Transfer NFT
const handlePrivateTransfer = async () => {
  if (!contract) {
    toast.error('Please connect your wallet first.');
    return;
  }

  if (!transferTokenId || !transferToAddress || !confirmToAddress) {
    toast.error('Please provide a valid Token ID and recipient address.');
    return;
  }

  if (transferToAddress !== confirmToAddress) {
    toast.error('Recipient addresses do not match.');
    return;
  }

  try {
    const tx = await contract.privateTransferNFT(transferToAddress, transferTokenId);
    toast.info(`Transferring Token ID ${transferTokenId} to ${transferToAddress}...`);
    await tx.wait();
    toast.success(`Token ID ${transferTokenId} has been successfully transferred to ${transferToAddress}.`);
    setTransferTokenId('');
    setTransferToAddress('');
    setConfirmToAddress('');
    fetchListedTokens();
    fetchOwnedTokens(); // Refresh owned NFTs
  } catch (error) {
    console.error('Error transferring NFT:', error);
    toast.error('Failed to transfer NFT.');
  }
};

  return (
    <div className="App">
      <ToastContainer />
      <h1>NFT Marketplace Test Frontend</h1>

      {/* Connect Wallet Section */}
      <div className="section">
        <h2>1. Connect Wallet</h2>
        {currentAccount ? (
          <p>
            <strong>Connected Account:</strong> {currentAccount}
          </p>
        ) : (
          <button onClick={connectWallet}>Connect MetaMask</button>
        )}
      </div>

      {/* Mint NFTs Section */}
      <div className="section">
        <h2>2. Mint NFT with Image</h2>
        <input
        type="text"
        placeholder="NFT Name"
        value={nftName}
        onChange={(e) => setNftName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="NFT Description"
          value={nftDescription}
          onChange={(e) => setNftDescription(e.target.value)}
        />
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <br />
        <input
          type="number"
          placeholder="Royalty Amount (Basis Points)"
          value={mintRoyalty}
          onChange={(e) => setMintRoyalty(e.target.value)}
        />
        <br />
        <button onClick={handleMint}>Mint NFT</button>
      </div>

      {/* User Owned Tokens Section */}
      <div className="section">
        <h2>3. View My owned NFTs</h2>
        <button onClick={fetchOwnedTokens}>Refresh My owned NFTs</button>
        <ul>
          {ownedTokens.length > 0 ? (
            ownedTokens.map((tokenId) => (
              <li key={tokenId}>
                <strong>Token ID:</strong> {tokenId}
                <NFTImage tokenId={tokenId} />
              </li>
            ))
          ) : (
            <p>You currently do not own any NFTs.</p>
          )}
        </ul>
      </div>

      {/* Private Transfer NFT Section */}
      <div className="section">
        <h2>4. Private Transfer NFT</h2>
        <input
          type="number"
          placeholder="Token ID"
          value={transferTokenId}
          onChange={(e) => setTransferTokenId(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Recipient Address"
          value={transferToAddress}
          onChange={(e) => setTransferToAddress(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Confirm Recipient Address"
          value={confirmToAddress}
          onChange={(e) => setConfirmToAddress(e.target.value)}
        />
        <br />
        <button onClick={handlePrivateTransfer}>Transfer NFT</button>
      </div>

      {/* List NFT Section */}
      <div className="section">
        <h2>5. List NFT</h2>
        <input
          type="number"
          placeholder="Token ID"
          value={listTokenId}
          onChange={(e) => setListTokenId(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Price in ETH"
          value={listPrice}
          onChange={(e) => setListPrice(e.target.value)}
        />
        <br />
        <button onClick={handleList}>List NFT</button>
      </div>

      {/* Unlist NFT Section */}
      <div className="section">
        <h2>6. Unlist NFT</h2>
        <input
          type="number"
          placeholder="Token ID"
          value={unlistTokenId}
          onChange={(e) => setUnlistTokenId(e.target.value)}
        />
        <br />
        <button onClick={handleUnlist}>Unlist NFT</button>
      </div>

      {/* Purchase NFT Section */}
      <div className="section">
        <h2>7. Purchase NFT</h2>
        <input
          type="number"
          placeholder="Token ID"
          value={purchaseTokenId}
          onChange={(e) => setPurchaseTokenId(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Price in ETH"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
        />
        <br />
        <button onClick={handlePurchase}>Purchase NFT</button>
      </div>

      {/* View Listed NFTs Section */}
      <div className="section">
        <h2>8. View Listed NFTs</h2>
        <button onClick={fetchListedTokens}>Refresh Listed NFTs</button>
        <ul>
          {listedTokens.length > 0 ? (
            listedTokens.map((token) => (
              <li key={token.tokenId}>
                <strong>Token ID:</strong> {token.tokenId} | <strong>Seller:</strong> {token.seller} |{' '}
                <strong>Price:</strong> {token.price} ETH
                <NFTImage tokenId={token.tokenId} />
              </li>
            ))
          ) : (
            <p>No NFTs listed.</p>
          )}
        </ul>
      </div>

      {/* Manage Marketplace Fee (Owner Only) Section */}
      <div className="section">
        <h2>9. Manage Marketplace Fee (Owner Only)</h2>
        <input
          type="number"
          placeholder="New Fee (Basis Points)"
          value={newFee}
          onChange={(e) => setNewFee(e.target.value)}
        />
        <br />
        <button onClick={handleSetFee}>Set Marketplace Fee</button>
      </div>

      {/* Pause/Unpause Contract (Owner Only) Section */}
      <div className="section">
        <h2>10. Pause/Unpause Contract (Owner Only)</h2>
        <button onClick={handlePause}>Pause Contract</button>
        <button onClick={handleUnpause}>Unpause Contract</button>
      </div>
    </div>
  );
}

export default App;