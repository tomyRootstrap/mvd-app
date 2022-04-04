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
import '../../components/side-bar/style.css';
import { useEffect, useState } from 'react';
import { useTopicsMutation } from 'services/topic/topic';
import SideBar from 'components/side-bar';
import sideBarIcon from '../../assets/aim.png';

const Home = () => {
  const t = useTranslation();
  const [logout, { isLoading }] = useLogoutMutation();
  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));
  const [createTarget, { isLoadingCreateTarget, isSuccess, error }] = useCreateTargetMutation();
  const [getTopics] = useTopicsMutation();
  const [topics, setTopics] = useState([]);
  const [target, setTarget] = useState({});
  const [latLng, setLatLng] = useState({});

  const [currentPosition, setCurrentPosition] = useState({
    ready: false,
    where: [],
    error: null,
  });
  const geoOptions = {
    enableHighAccuracy: true,
    timeout: 2000,
    maximumAge: 0,
  };
  const geolocationEnabled = () => {
    setCurrentPosition({ ready: false, error: null });
    return navigator.geolocation.getCurrentPosition(
      position => {
        geoSuccess(position);
      },
      () => {},
      geoOptions
    );
  };

  const geoSuccess = position => {
    setCurrentPosition({
      ready: true,
      where: [position.coords.latitude, position.coords.longitude],
    });
  };

  useEffect(() => {
    return geolocationEnabled();
  }, []);

  useEffect(() => {
    getTopics().then(data => {
      let topicsPipe = [];
      data.data.topics.map(topic => {
        topicsPipe.push(topic.topic);
      });
      setTopics(topicsPipe);
    });
  }, []);

  const schema = z.object({
    radius: z.string().min(1),
    title: z.string().min(1),
    topic_id: z.string().min(1),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = data => {
    debugger;
    createTarget({ ...data, ...latLng })
      .then(data => {})
      .catch(error => {});
  };

  const sendLatLng = dataFromChild => {
    setLatLng(dataFromChild);
  };

  return (
    <div className="home">
      <MapView currentPosition={currentPosition} sendLatLng={sendLatLng} />
      <SideBar title={'CREATE TARGET '}>
        <img className="side-bar-header-title-icon" src={sideBarIcon} alt=""></img>
        <h3 className="side-bar-header-sub-title">CREATE NEW TARGET</h3>
        {topics.length > 0 ? (
          <div>
            <form className="side-bar-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label htmlFor="radius">{t('home.create.radius')}</label>
              <Input register={register} type="text" name="radius" />

              <label htmlFor="title">{t('home.create.title')}</label>
              <Input register={register} type="text" name="title" />

              <label htmlFor="topic_id">{t('home.create.topic')}</label>
              <ComboBox register={register} name="topic_id" dataSource={topics} />

              <Button type="submit">{t('home.create.saveTarget')}</Button>
            </form>
          </div>
        ) : null}
      </SideBar>
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
