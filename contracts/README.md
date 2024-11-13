# NFT Marketplace Smart Contract

This contract is deployed on the Sepolia test network at address ~~`0x345ABB645864755320450984FC60372195EaAE53`~~`0x4b4d9e3e3b31a330c7da84be0ea1266aba9dadcd`. The Sepolia test network operates like the main network, where each transaction requires confirmation. Before interacting with this smart contract, please obtain 0.05 Sepolia ETH from [Google's Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) to facilitate interactions.

## How to Interact with the Smart Contract (Frontend)

1. **Setup**: Import `ethers.js`, the ABI, and the contract address into your frontend project.
2. **Connect Wallet**: Use MetaMask to connect to the contract, specifically through `window.ethereum` (wallet) as a Provider.
3. **Store Assets on IPFS**: Ensure any images or original files are stored on IPFS by deploying a local IPFS node. When users upload images or files:
   - First, upload the image to obtain an `imageURI`.
   - Then, create `metadata` as shown below:
     ```javascript
      const metadata = {
        name: nftName || `NFT #${Date.now()}`, // user input
        // If AI Gen, use AI prompt
        description: nftDescription || 'An NFT from NFTMarketplace', 
        image: imageURI,
        };
     ```
   - Upload this JSON `metadata` to IPFS to obtain `metadataURI`, which will serve as the `tokenURI` for minting.

4. **Mint NFT**: Call the contract function `batchMintNFT(tokenURIs, royaltyAmount)`, where `tokenURIs = [metadataURI]` to mint an NFT.

## Listing and Purchasing NFTs

- **List an NFT**: NFT owners can choose to list their NFTs on the marketplace. Only listed NFTs are available for purchase.
- **Purchase an NFT**: When an NFT is purchased, ownership is transferred to the buyer. The transaction involves four parties:
  - **Buyer**: Pays the listed price to purchase the NFT.
  - **Seller**: Receives payment after deductions.
  - **Original Creator**: Receives a royalty fee for each sale of the NFT.
  - **Marketplace Owner (Contract Owner)**: Collects a marketplace fee.

   After the marketplace fee (to the contract owner) and royalty fee (to the original creator) are deducted, the remaining amount is transferred to the seller.

- **Unlist an NFT**: NFT owners can unlist their tokens from the marketplace, making them unavailable for purchase.

## Key Contract Functions

- **`tokenID`**: The tokenID starts at 1 and increments by 1 with each minted token. Every time a token is minted, the tokenID increases by 1.
- **`batchMintNFT`**: Mint multiple NFTs with a specified tokenURIs and royalty amount in basis points (e.g., 500 for 5%)
- **`listToken`**: List an NFT for sale by transferring it to the contract address for escrow.
- **`unlistToken`**: Unlist an NFT from sale and return it from contract address to the seller.
- **`purchaseToken`**: Buy a listed NFT, automatically distributing payments to the seller, creator (royalty), and marketplace.
- **`setMarketplaceFee`**: Adjust the marketplace fee (only accessible by the contract owner).
- **`pause` / `unpause`**: Temporarily disable or enable contract functions (only contract owner).

This contract supports secure NFT trading with automated fee and royalty management, simplifying the process of minting, listing, and trading NFTs.
