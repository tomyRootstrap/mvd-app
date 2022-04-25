import { useEffect, useState } from 'react';
import { useLogoutMutation } from 'services/auth/auth';
import './style.css';
import icon from '../../assets/menu-icon.png';
import useTranslation from 'hooks/useTranslation';

export const Menu = ({ switchTab }) => {
  const t = useTranslation();
  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));
  const [logout] = useLogoutMutation();
  const changeTab = name => {
    switchTab(name);
  };
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const [isLogedIn, setIsLogedIn] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      setIsLogedIn(true);
    }
  }, []);
  return (
    <div className="hamburger-menu">
      <input className="menuToggle" type="checkbox" />
      <button className="menu__btn" htmlFor="menuToggle" onClick={handleClick}>
        <img src={icon} alt="Menu button" />
      </button>
      {isLogedIn ? (
        <ul className={`menu__box ${isOpen ? 'open' : 'close'}`}>
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
      ) : (
        <ul className={`menu__box ${isOpen ? 'open' : 'close'}`}>
          <li>
            <button className="menu__item" onClick={() => changeTab('EDIT_PROFILE')}>
              {t('menu.item.contact')}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};
export default Menu;
