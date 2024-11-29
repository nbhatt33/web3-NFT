
// import { parseEther } from 'ethers';
// import styles from './List.module.css';
// import backIcon from './back-icon.svg';
// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useSelector } from 'react-redux';
// import ipfs from '../ipfs';

// function List() {
//     const [count, setCount] = useState(1);
//     const [metadata, setMetadata] = useState(null);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { tokenId } = location.state || {};

//     const wallet = useSelector((state) => state.wallet.walletInfo);
//     const contract = useSelector((state) => state.contract.contract);

//     const getIPFSUrl = (url) => {
//         if (url.startsWith('ipfs://')) {
//             const cid = url.slice(7); // Remove 'ipfs://'
//             return `https://ipfs.io/ipfs/${cid}`;
//         }
//         return url;
//     };

//     const fetchMetadata = async () => {
//         try {
//             const tokenURI = await contract.tokenURI(tokenId);
//             console.log(`Token URI for Token ID ${tokenId}: ${tokenURI}`);

//             // Convert IPFS URI to HTTP URL
//             const metadataURI = getIPFSUrl(tokenURI);
//             console.log(`Fetching metadata from URI: ${metadataURI}`);

//             // Fetch the metadata from the metadataURI
//             // const response = await fetch(metadataURI);
//             // console.log(response);
//             // const metadata = await response.json();
//             // console.log('Metadata:', metadata);
//             const stream = ipfs.cat(metadataURI);
//             let data = '';

//             for await (const chunk of stream) {
//             data += new TextDecoder().decode(chunk);
//             }
//             const metadata = JSON.parse(data);
//             console.log('Metadata:', metadata);
//             metadata.image = `http://34.72.243.54:8080/ipfs/${metadata.image}`;
//             setMetadata(metadata);

//         } catch (error) {
//             console.error(`Error fetching metadata for Token ID ${tokenId}:`, error);
//         }
//     };

//     // Handle List NFT
// const handleList = async () => {
//     if (!contract) {
//       toast.error('Please connect your wallet first.');
//       return;
//     }

//     if (!listTokenId || !listPrice) {
//       toast.error('Please provide valid token ID and price.');
//       return;
//     }
//     const tokenId = parseInt(listTokenId);
//     const price = parseEther(listPrice);


//     try {
//       const tx = await contract.listToken(tokenId, price);
//       toast.info(`Listing Token ID ${tokenId}...`);
//       await tx.wait();
//       toast.success(`Token ID ${tokenId} listed for ${listPrice} ETH`);
//       setListTokenId('');
//       setListPrice('');
//       fetchListedTokens();
//       fetchOwnedTokens(); // Refresh owned NFTs
//     } catch (error) {
//       console.error('Listing error:', error);
//       toast.error('Failed to list NFT.');
//     }
//   };

//     useEffect(() => {
//         if (!wallet) {
//             toast.error('Please connect your wallet first.');
//             navigate('/');
//             return;
//         }
//         fetchMetadata();
//     }, [wallet, navigate]);

//     if (!metadata) {
//         return <div>Loading metadata...</div>;
//     }

//         return (
//         <div className={styles.payPage}>
//             <div className={styles.backIcon} onClick={() => navigate(-1)}>
//                 <img src={backIcon} alt=""/>
//             </div>
//             <div className={styles.mainContent}>
//                 <div className={styles.leftWrap}>
//                     <img
//                         src={metadata.image}
//                         alt=""/>
//                 </div>
//                 <div className={styles.rightWrap}>
//                     <div>
//                         <div className={styles.name}>{metadata.name}</div>
//                         <div className={styles.price}>
//                             <div className={styles.priceLable}>Price:</div>
//                             {/* <div>{metadata.price}</div> */}
//                             <input className={styles.inputDiv} value={count} onChange={(e) => setCount(e.target.value)}></input>
//                         </div>
//                         <div className={styles.count}>
//                             <div className={styles.countLable}>Count:</div>
//                             <input className={styles.inputDiv} value={count} onChange={(e) => setCount(e.target.value)}></input>
//                         </div>
//                     </div>
//                     <div className={styles.footer}>
//                         <button className={styles.buy}>List Now</button>
//                         {/* <button className={styles.sell}>Sell Now</button> */}
//                     </div>
//                 </div>
//             </div>
//         </div>

//     )
// }

// export default List;
import { parseEther } from 'ethers';
import styles from './List.module.css';
import backIcon from './back-icon.svg';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ipfs from '../ipfs';

function List() {
  const [listPrice, setListPrice] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [count, setCount] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const { tokenId } = location.state || {};

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
    //   const tokenURI = await contract.tokenURI(tokenId);
    //   console.log(`Token URI for Token ID ${tokenId}: ${tokenURI}`);

    //   // Convert IPFS URI to HTTP URL
    //   const metadataURI = getIPFSUrl(tokenURI);
    //   console.log(`Fetching metadata from URI: ${metadataURI}`);

    //   // Fetch the metadata from the metadataURI
    //   const response = await fetch(metadataURI);
    //   const metadata = await response.json();
    //   console.log('Metadata:', metadata);

    //   // Handle image URI
    //   metadata.image = getIPFSUrl(metadata.image);
    //   setMetadata(metadata);
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(`Token URI for Token ID ${tokenId}: ${tokenURI}`);

    // Convert IPFS URI to HTTP URL
    const metadataURI = getIPFSUrl(tokenURI);
    console.log(`Fetching metadata from URI: ${metadataURI}`);

    // Fetch the metadata from the metadataURI
    // const response = await fetch(metadataURI);
    // console.log(response);
    // const metadata = await response.json();
    // console.log('Metadata:', metadata);
    const stream = ipfs.cat(metadataURI);
    let data = '';

    for await (const chunk of stream) {
    data += new TextDecoder().decode(chunk);
    }
    const metadata = JSON.parse(data);
    console.log('Metadata:', metadata);
    metadata.image = `http://34.72.243.54:8080/ipfs/${metadata.image}`;
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

//   return (
//     <div className={styles.payPage}>
//       <div className={styles.backIcon} onClick={() => navigate(-1)}>
//         <img src={backIcon} alt="Back" />
//       </div>
//       <div className={styles.mainContent}>
//         <div className={styles.leftWrap}>
//           <img src={metadata.image} alt={metadata.name || 'NFT Image'} />
//         </div>
//         <div className={styles.rightWrap}>
//           <div>
//             <div className={styles.name}>{metadata.name || 'Unnamed Token'}</div>
//             <div className={styles.price}>
//               <div className={styles.priceLabel}>Price:</div>
//               <input
//                 className={styles.inputDiv}
//                 value={listPrice}
//                 onChange={(e) => setListPrice(e.target.value)}
//                 placeholder="Enter listing price in ETH"
//               />
//             </div>
//             {/* If you need a count input, you can add it here */}
//             <div className={styles.count}>
//               <div className={styles.countLabel}>Count:</div>
//               <input
//                 className={styles.inputDiv}
//                 value={count}
//                 onChange={(e) => setCount(e.target.value)}
//               />
//             </div>
//           </div>
//           <div className={styles.footer}>
//             <button className={styles.buy} onClick={handleList}>List Now</button>
//             {/* <button className={styles.sell}>Sell Now</button> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
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
                    <div>
                        <div className={styles.name}>{metadata.name}</div>
                        <div className={styles.price}>
                            <div className={styles.priceLable}>Price:</div>
                            {/* <div>{metadata.price}</div> */}
                            <input className={styles.inputDiv} value={listPrice} onChange={(e) => setListPrice(e.target.value)}></input>
                        </div>
                        <div className={styles.count}>
                            <div className={styles.countLable}>Count:</div>
                            <input className={styles.inputDiv} value={count} onChange={(e) => setCount(e.target.value)}></input>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <button className={styles.buy} onClick={handleList}>List Now</button>
                        {/* <button className={styles.sell}>Sell Now</button> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default List;
