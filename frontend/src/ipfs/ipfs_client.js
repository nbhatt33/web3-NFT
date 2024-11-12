import { PinataSDK } from "pinata-web3";

class IPFSClient {
  constructor(pinataJwt, pinataGateway) {
    this.pinata = new PinataSDK({
      pinataJwt,
      pinataGateway,
    });
  }

  // Method to upload a file to Pinata
  async uploadFile(file) {
    try {
      const upload = await this.pinata.upload.file(file);
      console.log("File uploaded:", upload);
      return upload;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Method to retrieve a file from Pinata by its IPFS hash
  async retrieveFile(ipfsHash) {
    try {
      const data = await this.pinata.gateways.get(ipfsHash);
      console.log("Retrieved file:", data);
      return data;
    } catch (error) {
      console.error("Error retrieving file:", error);
      throw error;
    }
  }

  // Method to write JSON to Pinata
  async uploadJSON(jsonData) {
    try {
      const upload = await this.pinata.upload.json(jsonData);
      console.log("JSON uploaded:", upload);
      return upload;
    } catch (error) {
      console.error("Error uploading JSON:", error);
      throw error;
    }
  }

  // Method to retrieve JSON from Pinata by its IPFS hash
  async retrieveJSON(ipfsHash) {
    try {
      const data = await this.pinata.gateways.get(ipfsHash);
      console.log("Retrieved data:", data);
      const jsonData = await data.data; // Parse the JSON response
      console.log("Retrieved JSON:", jsonData);
      return jsonData;
    } catch (error) {
      console.error("Error retrieving JSON:", error);
      throw error;
    }
  }
}

// Example usage
(async () => {
    const pinataJwt = process.env.PINATA_JWT;
    const pinataGateway = process.env.PINATA_GATEWAY;
    const ipfsClient = new IPFSClient(pinataJwt, pinataGateway);
  
    // Upload a file
    const file = new File(["hello from web3 class"], "testing.txt", { type: "text/plain" });
    const uploadResult = await ipfsClient.uploadFile(file);
    console.log("Uploaded file result:", uploadResult);
  
    // Retrieve a file
    const fileHash = uploadResult.IpfsHash;
    const retrievedFile = await ipfsClient.retrieveFile(fileHash);
    console.log("Retrieved file data:", retrievedFile);
  
    // Upload JSON
    const jsonData = { message: "Hello! IPFS from web3 class!" };
    const jsonUploadResult = await ipfsClient.uploadJSON(jsonData);
    console.log("Uploaded JSON result:", jsonUploadResult);
  
    // Retrieve JSON
    const jsonHash = jsonUploadResult.IpfsHash;
    const retrievedJSON = await ipfsClient.retrieveJSON(jsonHash);
    console.log("Retrieved JSON data:", retrievedJSON);
  })();