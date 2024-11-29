
// import styles from './Pay.module.css'
// import backIcon from './back-icon.svg'
// import {useState, useEffect} from "react";
// import { useLocation, useNavigate } from 'react-router-dom';


// async function Pay() {
//     const [count, setCount] = useState(1)
//     const location = useLocation(); 
//     const navigate = useNavigate();
//     const  token = location.state.collection || {}; 
//     // console.log('token:', token);
//     // const contractAddress = ContractAddress.address;
//     // const wallet = useSelector((state) => state.wallet.walletInfo);
//     // const contract = useSelector((state) => state.contract.contract);
//     // const tempProvider = new BrowserProvider(window.ethereum);
//     // const tempSigner = await tempProvider.getSigner();
//     // const tempContract = new Contract(contractAddress, NFTMarketplaceABI, tempSigner);
//     // console.log('contract:', contract);
//     // const [provider, setProvider] = useState(null);
//     // const [signer, setSigner] = useState(null);
//     // const [contract, setContract] = useState(null);
//     // const [currentAccount, setCurrentAccount] = useState(null);
//     // // const [contractAddress, setContractAddress] = useState(ContractAddress.address);
//     // const connectContract = async () => {
//     //     if (window.ethereum) {
//     //       try {
//     //         // Request account access
//     //         // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//     //         const tempProvider = new BrowserProvider(window.ethereum);
//     //         const tempSigner = await tempProvider.getSigner();
//     //         const tempContract = new Contract(contractAddress, NFTMarketplaceABI, tempSigner);
    
//     //         setProvider(tempProvider);
//     //         setSigner(tempSigner);
//     //         setContract(tempContract);
//     //         // setCurrentAccount(accounts[0]);
    
//     //         // toast.success('Wallet connected successfully!');
//     //       } catch (error) {
//     //         console.error('Error connecting wallet:', error);
//     //         toast.error('Failed to connect wallet.');
//     //       }
//     //     } else {
//     //       alert('Please install MetaMask!');
//     //     }
//     // };
    
//     // useEffect(() => {
//     //     // connectContract();
//     //     if (!wallet) {
//     //       toast.error('Please connect your wallet first.');
//     //       navigate('/');
//     //       return;
//     //     }
//     //   }, [wallet, navigate]);
//     // console.log('wallet:', wallet);

//     // Handle Purchase NFT
//     // const handlePurchase = async () => {
//     //     // if (!contract) {
//     //     // toast.error('Please connect your wallet first.');
//     //     // navigate('/');
//     //     // return;
//     //     // }

//     //     // const tokenId = parseInt(token.tokenId);
//     //     // const price = parseEther(token.price);
//     //     // console.log('tokenId:', typeof(tokenId), typeof(price));

//     //     // // const tokenId = parseInt(purchaseTokenId);
//     //     // // const price = parseEther(purchasePrice);

//     //     // if (!tokenId || !price) {
//     //     //     toast.error('Please provide valid token ID and price.');
//     //     //     return;
//     //     // }

//     //     // try {
//     //     // const tx = await contract.purchaseToken(tokenId, { value: price });
//     //     // toast.info(`Purchasing Token ID ${tokenId}...`);
//     //     // await tx.wait();
//     //     // toast.success(`Purchased Token ID ${tokenId} for ${price} ETH`);
//     //     // // setPurchaseTokenId('');
//     //     // // setPurchasePrice('');
//     //     // // fetchListedTokens();
//     //     // // fetchOwnedTokens(); // Refresh owned NFTs
//     //     // } catch (error) {
//     //     // console.error('Purchase error:', error);
//     //     // toast.error('Failed to purchase NFT.');
//     //     // }
//     // };

//     return (
//         <div className={styles.payPage}>
//             <div className={styles.backIcon} onClick={() => navigate(-1)}>
//                 <img src={backIcon} alt=""/>
//             </div>
//             <div className={styles.mainContent}>
//                 <div className={styles.leftWrap}>
//                     <img
//                         src={token.image}
//                         alt=""/>
//                 </div>
//                 <div className={styles.rightWrap}>
//                     <div>
//                         <div className={styles.name}>{token.name}</div>
//                         <div className={styles.price}>
//                             <div className={styles.priceLable}>Price:</div>
//                             <div>{token.price}</div>
//                         </div>
//                         <div className={styles.count}>
//                             <div className={styles.countLable}>Count:</div>
//                             <input className={styles.inputDiv} value={count} onChange={(e) => setCount(e.target.value)}></input>
//                         </div>
//                     </div>
//                     <div className={styles.footer}>
//                         <button className={styles.buy}>Buy Now</button>
//                         {/* <button className={styles.sell}>Sell Now</button> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Pay

import { parseEther } from 'ethers';
import styles from './Pay.module.css';
import backIcon from './back-icon.svg';
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function Pay() {
    const [count, setCount] = useState(1);
    const [purchaseTokenId, setPurchaseTokenId] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    
    const location = useLocation(); 
    const navigate = useNavigate();
    const token = location.state?.collection || {}; 

    const wallet = useSelector((state) => state.wallet.walletInfo);
    const contract = useSelector((state) => state.contract.contract);

    useEffect(() => {
        if (!wallet) {
            toast.error('Please connect your wallet first.');
            navigate('/');
        }
    }, [wallet, navigate]);

    // Define or import fetchListedTokens and fetchOwnedTokens
    const fetchListedTokens = async () => {
        // Implementation for fetching listed tokens
        // This could involve dispatching Redux actions or calling APIs
    };

    const fetchOwnedTokens = async () => {
        // Implementation for fetching owned tokens
        // This could involve dispatching Redux actions or calling APIs
    };

    // Handle Purchase NFT
    const handlePurchase = async () => {
        if (!contract) {
            toast.error('Please connect your wallet first.');
            navigate('/');
            return;
        }

        // Validate input fields
        if (!purchaseTokenId || !purchasePrice) {
            toast.error('Please provide both Token ID and Price.');
            return;
        }

        const tokenId = parseInt(purchaseTokenId);
        let price;
        try {
            price = parseEther(purchasePrice);
        } catch (error) {
            toast.error('Invalid price format. Please enter a valid ETH amount.');
            return;
        }

        if (isNaN(tokenId) || tokenId <= 0) {
            toast.error('Invalid Token ID. Please enter a positive number.');
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
            toast.error('Failed to purchase NFT. Please try again.');
        }
    };

    // Handle Sell NFT (Implementation depends on your contract's sell function)
    const handleSell = async () => {
        // Implement selling logic here
        toast.info('Sell functionality is not yet implemented.');
    };

//     return (
//         <div className={styles.payPage}>
//             <div className={styles.backIcon} onClick={() => navigate(-1)}>
//                 <img src={backIcon} alt="Back" />
//             </div>
//             <div className={styles.mainContent}>
//                 <div className={styles.leftWrap}>
//                     {token.image ? (
//                         <img src={token.image} alt={token.name || 'NFT Image'} />
//                     ) : (
//                         <div className={styles.placeholder}>No Image Available</div>
//                     )}
//                 </div>
//                 <div className={styles.rightWrap}>
//                     <div>
//                         <div className={styles.name}>{token.name || 'Unnamed Token'}</div>
//                         <div className={styles.price}>
//                             <div className={styles.priceLabel}>Price:</div>
//                             <div>{token.price ? `${token.price} ETH` : 'N/A'}</div>
//                         </div>
//                         <div className={styles.count}>
//                             <div className={styles.countLabel}>Count:</div>
//                             <input 
//                                 type="number"
//                                 min="1"
//                                 className={styles.inputDiv}
//                                 value={count}
//                                 onChange={(e) => setCount(Number(e.target.value))}
//                             />
//                         </div>
//                         {/* Optional: Inputs for Token ID and Price */}
//                         <div className={styles.tokenId}>
//                             <label htmlFor="tokenId">Token ID:</label>
//                             <input 
//                                 id="tokenId"
//                                 type="number"
//                                 min="1"
//                                 className={styles.inputDiv}
//                                 value={purchaseTokenId}
//                                 onChange={(e) => setPurchaseTokenId(e.target.value)}
//                                 placeholder="Enter Token ID"
//                             />
//                         </div>
//                         <div className={styles.purchasePrice}>
//                             <label htmlFor="purchasePrice">Price (ETH):</label>
//                             <input 
//                                 id="purchasePrice"
//                                 type="text"
//                                 className={styles.inputDiv}
//                                 value={purchasePrice}
//                                 onChange={(e) => setPurchasePrice(e.target.value)}
//                                 placeholder="Enter Price in ETH"
//                             />
//                         </div>
//                     </div>
//                     <div className={styles.footer}>
//                         <button 
//                             className={styles.buy} 
//                             onClick={handlePurchase}
//                             disabled={!purchaseTokenId || !purchasePrice}
//                         >
//                             Buy Now
//                         </button>
//                         <button 
//                             className={styles.sell} 
//                             onClick={handleSell}
//                             // Disable if sell functionality isn't implemented
//                         >
//                             Sell Now
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Pay;
    return (
        <div className={styles.payPage}>
            <div className={styles.backIcon} onClick={() => navigate(-1)}>
                <img src={backIcon} alt=""/>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.leftWrap}>
                    <img
                        src={token.image}
                        alt=""/>
                </div>
                <div className={styles.rightWrap}>
                    <div>
                        <div className={styles.name}>{token.name}</div>
                        <div className={styles.price}>
                            <div className={styles.priceLable}>Price:</div>
                            <div>{token.price}</div>
                        </div>
                        <div className={styles.count}>
                            <div className={styles.countLable}>Count:</div>
                            <input className={styles.inputDiv} value={count} onChange={(e) => setCount(e.target.value)}></input>
                        </div>
                    </div>
                    <div className={styles.footer}>
                        <button className={styles.buy}>Buy Now</button>
                        {/* <button className={styles.sell}>Sell Now</button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Pay