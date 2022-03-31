import React, { Component } from 'react';
import logo from '../../assets/smilies.png';

const SideBar = props => {
  return (
    <div>
      <h1>{props.title}</h1>
      {props.children}
      <img src={logo} alt=""></img>
    </div>
  );
};

export default SideBar;
