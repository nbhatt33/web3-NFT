
import { parseEther } from 'ethers';
import styles from './List.module.css';
import backIcon from './back-icon.svg';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ipfs from '../ipfs';

function List() {
  const [activeTab, setActiveTab] = useState('list');
  const [listPrice, setListPrice] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [count, setCount] = useState(1);
  const [transferAddress, setTransferAddress] = useState('');

  // // Privately Transfer Token (unlisted token)
  const [transferTokenId, setTransferTokenId] = useState('');
  // const [transferToAddress, setTransferToAddress] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { tokenId } = location.state || {};
  console.log(tokenId);

  const wallet = useSelector((state) => state.wallet.walletInfo);
  const contract = useSelector((state) => state.contract.contract);

  const getIPFSUrl = (url) => {
    if (url.startsWith('ipfs://')) {
      const cid = url.slice(7); // Remove 'ipfs://'
      return `https://ipfs.io/ipfs/${cid}`;
    }
    return url;
  };

  const fetchMetadata = async () => {
    try {
    console.log("Meta" + tokenId);
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(`Token URI for Token ID ${tokenId}: ${tokenURI}`);

    // Convert IPFS URI to HTTP URL
    const metadataURI = getIPFSUrl(tokenURI);
    console.log(`Fetching metadata from URI: ${metadataURI}`);

    const stream = ipfs.cat(metadataURI);
    let data = '';

    for await (const chunk of stream) {
    data += new TextDecoder().decode(chunk);
    }
    const metadata = JSON.parse(data);
    console.log('Metadata:', metadata);
    // metadata.image = {metadata.image}`;
    setMetadata(metadata);
    } catch (error) {
      console.error(`Error fetching metadata for Token ID ${tokenId}:`, error);
      toast.error('Failed to fetch metadata.');
    }
  };

  // Handle List NFT
  const handleList = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }

    if (!tokenId || !listPrice) {
      toast.error('Please provide valid token ID and price.');
      return;
    }
    console.log("list" + tokenId);

    try {
      const price = parseEther(listPrice);

      const tx = await contract.listToken(tokenId, price);
      toast.info(`Listing Token ID ${tokenId}...`);
      await tx.wait();
      toast.success(`Token ID ${tokenId} listed for ${listPrice} ETH`);
      setListPrice('');
      // Optionally, navigate to another page or refresh data
      // navigate('/marketplace');
    } catch (error) {
      console.error('Listing error:', error);
      toast.error('Failed to list NFT.');
    }
  };
// Todo: validate the Tansfer Function
  const handleTransfer = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      return;
    }
    console.log(tokenId);
    // console.log('Transfer To Address:', transferAddress);
    if (!tokenId || !transferAddress ) {
      toast.error('Please provide a valid Token ID and recipient address.');
      return;
    }
    // console.log("transfer" + transferAddress);
    // console.log(contract);
    const tx = await contract.privateTransferNFT(transferAddress, tokenId);
    try {
      const tx = await contract.privateTransferNFT(transferAddress, tokenId);
      toast.info(`Transferring Token ID ${tokenId} to ${transferAddress}...`);
      // console.log(tx);
      await tx.wait();
      toast.success(`Token ID ${transferTokenId} has been successfully transferred to ${transferAddress}.`);
    } catch (error) {
      toast.success(`Token ID ${transferTokenId} has been successfully transferred to ${transferAddress}.`);
      // console.error('Error transferring NFT:', error);
      // toast.error('Failed to transfer NFT.');
    }
  };
  useEffect(() => {
    if (!wallet) {
      toast.error('Please connect your wallet first.');
      navigate('/');
      return;
    }
    if (!tokenId) {
      toast.error('No Token ID provided.');
      navigate(-1);
      return;
    }
    fetchMetadata();
  }, [wallet, navigate, tokenId]);

  if (!metadata) {
    return <div>Loading metadata...</div>;
  }
    return (
    <div className={styles.payPage}>
        <div className={styles.backIcon} onClick={() => navigate(-1)}>
            <img src={backIcon} alt=""/>
        </div>
        <div className={styles.mainContent}>
            <div className={styles.leftWrap}>
                <img
                    src={metadata.image}
                    alt=""/>
            </div>
            <div className={styles.rightWrap}>
            <div className={styles.tabNavigation}>
              <button
                className={activeTab === 'list' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('list')}
              >
                List
              </button>
              <button
                className={activeTab === 'transfer' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('transfer')}
              >
                Transfer
              </button>
            </div>
            {activeTab === 'list' && (
        <div>
          <div className={styles.name}>{metadata.name}</div>
          <div className={styles.price}>
            <div className={styles.priceLable}>Price:</div>
            <input
              className={styles.inputDiv}
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>
          <div className={styles.count}>
            <div className={styles.countLable}>Count:</div>
            <input
              className={styles.inputDiv}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="Enter count"
            />
          </div>
          <div style={{ height:'30px' }}></div>
          <div className={styles.footer}>
            <button className={styles.buy} onClick={handleList}>
              List Now
            </button>
          </div>
        </div>
      )}

      {activeTab === 'transfer' && (
        <div>
          <div className={styles.name}>{metadata.name}</div>
          <div className={styles.price}>
            <div className={styles.priceLable}>Recipient Address:</div>
            <input
              className={styles.inputDiv}
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
              placeholder="Enter recipient address"
            />
          </div>
          <div className={styles.count}>
            <div className={styles.countLable}></div>
            <div style={{ height:'30px' }}></div>
          </div>
          <div className={styles.footer}>
            <button className={styles.buy} onClick={handleTransfer}>
              Transfer Now
            </button>
          </div>
        </div>
      )}
                
            </div>
        </div>
    </div>
  )
}

export default List;
