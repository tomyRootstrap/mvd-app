import React from 'react';
import './style.css';
import icon from '../../assets/menu-icon.png';

export const Menu = () => {
  return (
    <div className="hamburger-menu">
      <input id="menu__toggle" type="checkbox" />
      <label className="menu__btn" htmlFor="menu__toggle">
        <span></span>
      </label>
      <ul className="menu__box">
        <li>
          <p className="menu__item">Edit profile</p>
        </li>
        <li>
          <p className="menu__item">Create target</p>
        </li>
      </ul>
    </div>
  );
};
export default Menu;
