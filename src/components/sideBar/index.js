import Menu from 'components/menu';
import useTranslation from 'hooks/useTranslation';
import React, { Component } from 'react';
import logo from '../../assets/smilies.png';

import './style.css';

const SideBar = props => {
  const t = useTranslation();
  return (
    <div className="side-bar">
      <div className="side-bar-header">
        <div className="w-10">
          <Menu />
        </div>
        <div className="w-90">
          <h1 className="side-bar-header-title">{t(props.title)}</h1>
        </div>
      </div>

      {props.children}
      <img className="smiles" src={logo} alt=""></img>
    </div>
  );
};

export default SideBar;
