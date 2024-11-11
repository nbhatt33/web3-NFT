contract NFTMarketplace is ERC721URIStorage, IERC2981, Ownable, ReentrancyGuard, Pausable {
    uint256 private _tokenIds = 0;
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