import React from 'react';
import { useLogoutMutation } from 'services/auth/auth';
import './style.css';

export const Menu = ({ switchTab }) => {
  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));
  const [logout] = useLogoutMutation();
  const changeTab = name => {
    switchTab(name);
  };
  return (
    <div className="hamburger-menu">
      <input id="menu__toggle" type="checkbox" />
      <label className="menu__btn" htmlFor="menu__toggle">
        <span></span>
      </label>
      <ul className="menu__box">
        <li>
          <button className="menu__item" onClick={() => changeTab('EDIT_PROFILE')}>
            Edit profile
          </button>
        </li>
        <li>
          <button className="menu__item" onClick={() => changeTab('CREATE_TARGET')}>
            Create target
          </button>
        </li>
        <li>
          <button className="menu__item" onClick={() => handleLogout()}>
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};
export default Menu;
