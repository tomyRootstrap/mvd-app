import React, { Component } from 'react';
import logo from '../../assets/smilies.png';
import './style.css';

const SideBar = props => {
  return (
    <div className="side-bar">
      <h1>{props.title}</h1>
      {props.children}
      <img src={logo} alt=""></img>
    </div>
  );
};

export default SideBar;
