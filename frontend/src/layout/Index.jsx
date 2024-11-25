import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { setWalletInfo, setIsLoggedIn } from '../redux/features/walletSlice'; // Import Redux actions
import { BrowserProvider, Contract, formatEther } from 'ethers'; // Ethers library for blockchain interaction
import { toast } from 'react-toastify'; // Library for user notifications
import 'react-toastify/dist/ReactToastify.css'; // Toast styles
import ContractAddress from '../ContractAddress.json'; // Smart contract address
import NFTMarketplaceABI from '../NFTMarketplaceABI.json'; // Smart contract ABI
import './index.css'; // Custom styles

const Layout = () => {
  const navigate = useNavigate(); // React Router for navigation
  const dispatch = useDispatch(); // Redux dispatch function

  // Fetch wallet information from Redux state
  const wallet = useSelector((state) => state.wallet.walletInfo);
  const isLoggedIn = useSelector((state) => state.wallet.isLoggedIn);

  // Local state for blockchain interaction
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [inputAddress, setInputAddress] = useState(''); // Manually entered wallet address

  const contractAddress = ContractAddress.address; // Load contract address from file

  // Connect wallet using MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Initialize provider, signer, and contract
        const tempProvider = new BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const tempContract = new Contract(contractAddress, NFTMarketplaceABI, tempSigner);

        // Fetch wallet balance and format to 4 decimal places
        const balance = await tempProvider.getBalance(accounts[0]);
        const formattedBalance = Number(formatEther(balance)).toFixed(4);

        // Update local state
        setProvider(tempProvider);
        setSigner(tempSigner);
        setContract(tempContract);
        setCurrentAccount(accounts[0]);

        // Update Redux state with wallet info
        const walletInfo = {
          address: accounts[0],
          balance: `${formattedBalance} ETH`,
        };

        dispatch(setWalletInfo(walletInfo));
        dispatch(setIsLoggedIn(true));

        toast.success('Wallet connected successfully!'); // Notify user of success
      } catch (error) {
        console.error('Error connecting wallet:', error);
        toast.error('Failed to connect wallet. Please try again.'); // Notify user of failure
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
    }
  };

  // Use manually entered wallet address
  const useInputAddress = () => {
    if (!inputAddress) {
      alert('Please enter a valid wallet address.');
      return;
    }

    // Mock wallet info for manual input
    const walletInfo = {
      address: inputAddress,
      balance: '0.00 ETH', // Default balance
    };

    dispatch(setWalletInfo(walletInfo)); // Update Redux state
    dispatch(setIsLoggedIn(true)); // Set user as logged in
    toast.success('Wallet information updated!'); // Notify user
  };

  // Navigate to a specific page
  const goPage = (path) => {
    navigate(path);
  };

  return (
    <div className="outer_container">
      <div className="group_1 flex-row">
        {/* Header and navigation links */}
        <span className="text_1">NFT</span>
        <span className="text_2 cursor" onClick={() => goPage('/')}>Home</span>
        <span className="text_3 cursor" onClick={() => goPage('/marketplace')}>Marketplace</span>
        <span className="text_4 cursor" onClick={() => goPage('/mint')}>Minting</span>
        <span className="text_5 cursor" onClick={() => goPage('/gen')}>AI Artwork</span>
        <span className="text_6 cursor" onClick={() => goPage('/user')}>User Profile</span>

        <div className="text-wrapper_1 flex-col">
          {/* Display wallet info if logged in */}
          {isLoggedIn ? (
            <div>
              {/* <span className="text_7">Address: {wallet.address}</span> */}
              <span className="text_7">Balance: {wallet.balance}</span>
            </div>
          ) : (
            // Show "Connect Wallet" button if not logged in
            <span className="text_7 cursor" onClick={connectWallet}>
              Connect with your wallet
            </span>
          )}
        </div>
      </div>
      {/* Render child components */}
      <Outlet />
    </div>
  );
};

export default Layout;
