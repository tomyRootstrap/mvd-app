import React, { Component } from 'react';
import logo from '../../assets/smilies.png';

import './style.css';

const SideBar = props => {
  return (
    <div className="side-bar">
      <div className="side-bar-header">
        <h1 className="side-bar-header-title">{props.title}</h1>
      </div>

      {props.children}
      <img className="smiles" src={logo} alt=""></img>
    </div>
  );
};

export default SideBar;
