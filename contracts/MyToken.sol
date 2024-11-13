// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// OpenZeppelin library imports
import "@openzeppelin/contracts@4.8.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.8.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.0/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts@4.8.0/security/Pausable.sol";
import "@openzeppelin/contracts@4.8.0/interfaces/IERC2981.sol";
import "@openzeppelin/contracts@4.8.0/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC721Enumerable, ERC721URIStorage, IERC2981, Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public marketplaceFee = 250; // Marketplace fee in basis points (2.5%)
    address payable public feeRecipient; // Recipient of marketplace fees

    struct ListedToken {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    struct RoyaltyInfo {
        address recipient;
        uint256 amount; // Royalty amount in basis points (e.g., 500 for 5%)
    }

    mapping(uint256 => ListedToken) public listedTokens;
    mapping(uint256 => RoyaltyInfo) private _royalties;

    // Events
    event TokenMinted(uint256 indexed tokenId, address owner, string tokenURI);
    event TokenListed(uint256 indexed tokenId, address seller, uint256 price);
    event TokenUnlisted(uint256 indexed tokenId, address seller);
    event TokenPurchased(uint256 indexed tokenId, address buyer, uint256 price);
    event RoyaltySet(uint256 indexed tokenId, address recipient, uint256 amount);

    // Can be tracked
    event TokenPrivatelyTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    constructor(address payable _feeRecipient) ERC721("MyNFT", "MNFT") {
        feeRecipient = _feeRecipient;
    }

    // Set marketplace fee (only owner)
    function setMarketplaceFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee cannot exceed 10%");
        marketplaceFee = _fee;
    }

    // function totalSupply() public view returns (uint256) {
    //     return _tokenIds;
    // }

    // Set royalty information for a token
    function _setTokenRoyalty(uint256 tokenId, address recipient, uint256 amount) internal {
        require(amount <= 1000, "Royalty cannot exceed 10%");
        _royalties[tokenId] = RoyaltyInfo(recipient, amount);
        emit RoyaltySet(tokenId, recipient, amount);
    }

    // Implement royaltyInfo function of IERC2981
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address, uint256)
    {
        RoyaltyInfo memory royalty = _royalties[tokenId];
        uint256 royaltyAmount = (salePrice * royalty.amount) / 10000;
        return (royalty.recipient, royaltyAmount);
    }

    // Batch mint NFTs
    function batchMintNFT(string[] memory tokenURIs, uint256 royaltyAmount) public whenNotPaused returns (uint256[] memory) {
        uint256 count = tokenURIs.length;
        require(count > 0, "At least one tokenURI is required");
        uint256[] memory tokenIds = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();

            _safeMint(msg.sender, newTokenId);
            _setTokenURI(newTokenId, tokenURIs[i]);
            _setTokenRoyalty(newTokenId, msg.sender, royaltyAmount);

            tokenIds[i] = newTokenId;

            emit TokenMinted(newTokenId, msg.sender, tokenURIs[i]);
        }

        return tokenIds;
    }

    // List NFT on the marketplace
    function listToken(uint256 tokenId, uint256 price) public whenNotPaused {
        // Check 
        require(!listedTokens[tokenId].isListed, "NFT is already listed");
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(price > 0, "Price must be greater than zero");
        // Transfer the NFT to the contract for escrow
        _transfer(msg.sender, address(this), tokenId);

        listedTokens[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            price,
            true
        );

        emit TokenListed(tokenId, msg.sender, price);
    }

    // Unlist NFT from the marketplace
    function unlistToken(uint256 tokenId) public whenNotPaused {
        ListedToken memory listedToken = listedTokens[tokenId];
        require(listedToken.isListed, "This NFT is not listed");
        require(listedToken.seller == msg.sender, "You are not the seller");

        // Return the NFT to the seller
        _transfer(address(this), msg.sender, tokenId);

        listedToken.isListed = false;
        listedTokens[tokenId] = listedToken;

        emit TokenUnlisted(tokenId, msg.sender);
    }

    // Purchase NFT
    function purchaseToken(uint256 tokenId) public payable nonReentrant whenNotPaused {
        ListedToken memory listedToken = listedTokens[tokenId];
        require(listedToken.isListed, "This NFT is not listed for sale");
        require(msg.value >= listedToken.price, "Insufficient payment");

        uint256 salePrice = listedToken.price;

        // Calculate marketplace fee
        uint256 fee = (salePrice * marketplaceFee) / 10000;
        feeRecipient.transfer(fee);

        // Calculate royalty
        RoyaltyInfo memory royalty = _royalties[tokenId];
        uint256 royaltyAmount = (salePrice * royalty.amount) / 10000;
        payable(royalty.recipient).transfer(royaltyAmount);

        // Transfer remaining funds to the seller
        uint256 sellerAmount = salePrice - fee - royaltyAmount;
        listedToken.seller.transfer(sellerAmount);

        // Transfer the NFT to the buyer
        _transfer(address(this), msg.sender, tokenId);

        listedToken.isListed = false;
        listedTokens[tokenId] = listedToken;

        emit TokenPurchased(tokenId, msg.sender, salePrice);

        // Refund any excess payment
        if (msg.value > salePrice) {
            payable(msg.sender).transfer(msg.value - salePrice);
        }
    }

    // Private transfer for unlisted NFTs
    function privateTransferNFT(address to, uint256 tokenId) external whenNotPaused {
        require(!listedTokens[tokenId].isListed, "Cannot transfer a listed NFT");
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(to != address(0), "Invalid recipient");

        // Perform the transfer
        _transfer(msg.sender, to, tokenId);

        emit TokenPrivatelyTransferred(tokenId, msg.sender, to);
    }

    // Pause the contract (only owner)
    function pause() external onlyOwner {
        _pause();
    }

    // Unpause the contract (only owner)
    function unpause() external onlyOwner {
        _unpause();
    }

    // Override _beforeTokenTransfer to ensure that token transfers are paused when the contract is paused
    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     uint256 batchSize
    // ) internal whenNotPaused override(ERC721) {
    //     super._beforeTokenTransfer(from, to, tokenId, batchSize);
    // }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    

    // Implement supportsInterface to handle multiple inheritance
    // function supportsInterface(bytes4 interfaceId)
    //     public
    //     view
    //     override(ERC721, IERC165)
    //     returns (bool)
    // {
    //     return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    // }

    // Get listed token information
    function getListedToken(uint256 tokenId) public view returns (ListedToken memory) {
        return listedTokens[tokenId];
    }
}