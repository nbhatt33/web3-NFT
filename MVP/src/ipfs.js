// src/ipfs.js
import { create } from 'ipfs-http-client';

// Initialize IPFS client
const ipfs = create({ url: 'http://34.72.243.54:5001/api/v0' }); 

export default ipfs;