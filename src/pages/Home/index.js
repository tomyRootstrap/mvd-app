import Button from 'components/common/Button';
import useTranslation from 'hooks/useTranslation';
import { useLogoutMutation } from 'services/auth/auth';
import MapView from 'components/Map';
import { useCreateTargetMutation } from 'services/target/target';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from 'components/form/Input';
import ComboBox from 'components/form/ComboBox';

import './styles.css';

const Home = () => {
  const t = useTranslation();
  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));
  const [createTarget, { isLoadingCreateTarget, isSuccess, error }] = useCreateTargetMutation();
  const topics = [
    { value: 'topic1', name: 'topic1' },
    { value: 'topic2', name: 'topic2' },
  ];

  const schema = z.object({
    area: z.string().min(1),
    targetTitle: z.string().min(1),
    topic: z.string().min(1),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = data => {
    createTarget(data);
  };
  return (
    <div className="home">
      <MapView />
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="area">{t('home.create.area')}</label>
          <Input register={register} type="text" name="area" />
          <label htmlFor="targetTitle">{t('home.create.targetTitle')}</label>
          <Input register={register} type="text" name="targetTitle" />
          <label htmlFor="topic">{t('home.create.topic')}</label>
          <ComboBox register={register} name="topic" dataSource={topics} />
        </form>
      </div>
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
