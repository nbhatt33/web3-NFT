// import { parseEther } from 'ethers';
// import styles from './Pay.module.css';
// import backIcon from './back-icon.svg';
// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useSelector } from 'react-redux';

// function Pay() {
//     const [count, setCount] = useState(1);
//     const [purchaseTokenId, setPurchaseTokenId] = useState('');
//     const [purchasePrice, setPurchasePrice] = useState('');
    
//     const location = useLocation(); 
//     const navigate = useNavigate();
//     const token = location.state?.collection || {}; 

//     const wallet = useSelector((state) => state.wallet.walletInfo);
//     const contract = useSelector((state) => state.contract.contract);

//     useEffect(() => {
//         if (!wallet) {
//             toast.error('Please connect your wallet first.');
//             navigate('/');
//         }
//     }, [wallet, navigate]);


//     // Handle Purchase NFT
//     const handlePurchase = async () => {
//         if (!contract) {
//             toast.error('Please connect your wallet first.');
//             navigate('/');
//             return;
//         }

//         // Validate input fields
//         if (!purchaseTokenId || !purchasePrice) {
//             toast.error('Please provide both Token ID and Price.');
//             return;
//         }

//         const tokenId = parseInt(purchaseTokenId);
//         let price;
//         try {
//             price = parseEther(purchasePrice);
//         } catch (error) {
//             toast.error('Invalid price format. Please enter a valid ETH amount.');
//             return;
//         }

//         if (isNaN(tokenId) || tokenId <= 0) {
//             toast.error('Invalid Token ID. Please enter a positive number.');
//             return;
//         }

//         try {
//             const tx = await contract.purchaseToken(tokenId, { value: price });
//             toast.info(`Purchasing Token ID ${tokenId}...`);
//             await tx.wait();
//             toast.success(`Purchased Token ID ${tokenId} for ${purchasePrice} ETH`);
//             // setPurchaseTokenId('');
//             // setPurchasePrice('');
//             // fetchListedTokens();
//             // fetchOwnedTokens(); // Refresh owned NFTs
//         } catch (error) {
//             console.error('Purchase error:', error);
//             toast.error('Failed to purchase NFT. Please try again.');
//         }
//     };

//     const handleUnlist = async () => {
//         if (!contract) {
//           toast.error('Please connect your wallet first.');
//           return;
//         }
    
//         const tokenId = parseInt(unlistTokenId);
    
//         if (!tokenId) {
//           toast.error('Please provide a valid token ID.');
//           return;
//         }
    
//         try {
//           const tx = await contract.unlistToken(tokenId);
//           toast.info(`Unlisting Token ID ${tokenId}...`);
//           await tx.wait();
//           toast.success(`Token ID ${tokenId} unlisted successfully`);
//           setUnlistTokenId('');
//           fetchListedTokens();
//           fetchOwnedTokens(); // Refresh owned NFTs
//         } catch (error) {
//           console.error('Unlisting error:', error);
//           toast.error('Failed to unlist NFT.');
//         }
//       };

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
//                         <div>
//                             <div>{token.describtion}</div>
//                         </div>
//                     </div>
//                     <div className={styles.footer}>
//                         <button className={styles.buy}>Buy Now</button>
//                         <button className={styles.sell} onClick={}>Unlist Now</button>
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
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

function Pay() {
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
    if (!token || !token.tokenId || !token.price) {
      toast.error('Token data is missing.');
      navigate(-1);
    }
  }, [wallet, navigate, token]);

  // Tode: Valide the purchase function
  // Handle Purchase NFT
  const handlePurchase = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      navigate('/');
      return;
    }

    const tokenId = token.tokenId;
    const priceInEth = token.price;

    if (!tokenId || !priceInEth) {
      toast.error('Token information is missing.');
      return;
    }

    let price;
    try {
      price = parseEther(priceInEth.toString());
    } catch (error) {
      toast.error('Invalid price format.');
      return;
    }

    try {
      const tx = await contract.purchaseToken(tokenId, { value: price });
      toast.info(`Purchasing Token ID ${tokenId}...`);
      await tx.wait();
      toast.success(`Purchased Token ID ${tokenId} for ${priceInEth} ETH`);
      // Optionally, navigate to another page or refresh data
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to purchase NFT. Please try again.');
    }
  };

  // Handle Unlist NFT
  const handleUnlist = async () => {
    if (!contract) {
      toast.error('Please connect your wallet first.');
      navigate('/');
      return;
    }

    const tokenId = token.tokenId;

    if (!tokenId) {
      toast.error('Token ID is missing.');
      return;
    }

    try {
      const tx = await contract.unlistToken(tokenId);
      toast.info(`Unlisting Token ID ${tokenId}...`);
      await tx.wait();
      toast.success(`Token ID ${tokenId} unlisted successfully`);
      // Optionally, navigate to another page or refresh data
    } catch (error) {
      console.error('Unlisting error:', error);
      toast.error('This NFT does not belong to you.');
    }
  };

  return (
    <div className={styles.payPage}>
      <div className={styles.backIcon} onClick={() => navigate(-1)}>
        <img src={backIcon} alt="Back" />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.leftWrap}>
          {token.image ? (
            <img src={token.image} alt={token.name || 'NFT Image'} />
          ) : (
            <div>No Image Available</div>
          )}
        </div>
        <div className={styles.rightWrap}>
          <div>
            <div className={styles.name}>{token.name || 'Unnamed Token'}</div>
            <div className={styles.price}>
              <div className={styles.priceLabel}>Price:</div>
              <div>{token.price ? `${token.price} ETH` : 'N/A'}</div>
            </div>
            {/* Remove Count Input if Not Used */}
            {/* <div className={styles.count}>
              <div className={styles.countLabel}>Count:</div>
              <input
                className={styles.inputDiv}
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div> */}
            <div>{token.description || 'No description available.'}</div>
          </div>
          <div className={styles.footer}>
            <button className={styles.buy} onClick={handlePurchase}>
              Buy Now
            </button>
            <button className={styles.sell} onClick={handleUnlist}>
              Unlist Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pay;
