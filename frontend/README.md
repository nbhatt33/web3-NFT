# NFT Marketplace Frontend

This dir contains the frontend for the NFT Marketplace, a platform where users can mint, buy, and sell digital art NFTs. The application integrates with blockchain technology and provides a seamless user experience for managing NFTs.

Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nbhatt33/web3-NFT.git
   cd frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm start
   ```

## Folder Structure

```
BLOCKCHAIN/
├── backend/                     # Backend-related files (not shown in detail in the screenshot)
├── contracts/                   # Smart contract files and related resources
├── frontend/                    # Frontend codebase
│   ├── node_modules/            # Project dependencies (installed via npm)
│   ├── public/                  # Public assets (e.g., static files like images, index.html)
│   ├── src/                     # Source code for the frontend
│   │   ├── layout/              # Layout components for shared UI structure
│   │   ├── ListNFT/             # Components for listing NFTs
│   │   ├── NFTGenerator/        # Components for generating/minting NFTs
│   │   ├── NFTMarketplace/      # Components for the NFT marketplace page
│   │   ├── PayNFT/              # Components for handling NFT payments
│   │   ├── redux/               # Redux store and slices for state management
│   │   ├── SearchNFT/           # Components for searching NFTs
│   │   ├── UserNFTs/            # Components for managing and displaying user-owned NFTs
│   │   ├── App.css              # Global styles for the application
│   │   ├── App.js               # Main application entry point
│   │   ├── ContractAddress.json # JSON file containing smart contract addresses
│   │   ├── index.css            # Additional global styles
│   │   ├── index.js             # Entry point for rendering the React app
│   │   ├── ipfs.js              # Utility for interacting with IPFS
│   │   ├── NFTImage.js          # Component for displaying NFT images
│   │   ├── NFTMarketplaceABI.json # ABI file for interacting with the NFT Marketplace smart contract
│   │   ├── reportWebVitals.js   # Performance monitoring setup
│   │   ├── logo.svg             # Project logo
│   └── ...
├── .gitignore                   # Git configuration to exclude specific files/folders
├── package-lock.json            # Lockfile for npm dependencies
├── package.json                 # Configuration file for the frontend project
├── README.md                    # Documentation for the project
```
