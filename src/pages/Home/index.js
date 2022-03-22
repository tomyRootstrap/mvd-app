import Button from 'components/common/Button';
import useTranslation from 'hooks/useTranslation';
import { useLogoutMutation } from 'services/auth/auth';
import MapView from 'components/Map/index';

import './styles.css';

const Home = () => {
  const t = useTranslation();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));

  return (
    <div className="home">
      <MapView />
      <h1>{t('home.welcomeMsg')}</h1>
      <div className="home__logout">
        <Button handleClick={handleLogout} disabled={isLoading}>
          {t('home.logoutBtn')}
        </Button>
      </div>
    </div>
  );
};

export default Home;
