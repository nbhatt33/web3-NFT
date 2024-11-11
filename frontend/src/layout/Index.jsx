import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './index.css';

const Layout = () => {
  const navigate = useNavigate();

  const goPage = (path) => {
    navigate(path);
  };

  return (
    <div className="outer_container">
      <div className="group_1 flex-row">

        <span className="text_1">NFT</span>
        <span className="text_2 cursor" onClick={() => goPage('/')}>Home</span>
        <span className="text_3 cursor" onClick={() => goPage('/marketplace')}>Marketplace</span>
        <span className="text_4 cursor" onClick={() => goPage('/mint')}>Minting</span>
        <span className="text_5" onClick={() => goPage('/gen')}>AI&nbsp;Artwork</span>
        <span className="text_6" onClick={() => goPage('/user')}>User&nbsp;Profile</span>
        <div className="text-wrapper_1 flex-col">
          <span className="text_7">Connect&nbsp;with&nbsp;your&nbsp;wallet</span>
        </div>

      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
