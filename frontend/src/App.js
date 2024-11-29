import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Index';
import Home from './NFTMarketplace/NFTMarketplace';
import Marketplace from './SearchNFT/SearchNFT';
import Mint from './MintNFT/MintNFT';
import UserNFTs from './UserNFTs/UserNFTs';
import Generator from './NFTGenerator/NFTGenerator'
import Pay from './PayNFT/PayNFT';
import List from './ListNFT/ListNFT';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Header />}> */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="user" element={<UserNFTs />} />
          <Route path="mint" element={<Mint />} />
          <Route path="gen" element={<Generator />} />
          <Route path="/pay/:tokenId" element={<Pay />} />
          <Route path="/list" element={<List />} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
