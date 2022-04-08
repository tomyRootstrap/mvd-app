import Button from 'components/common/Button';
import useTranslation from 'hooks/useTranslation';
import { useLogoutMutation } from 'services/auth/auth';
import MapView from 'components/Map';
import { useCreateTargetMutation, useGetTargetsQuery } from 'services/target/target';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from 'components/form/Input';
import ComboBox from 'components/form/ComboBox';

import './styles.css';
import '../../components/sideBar/style.css';
import { useEffect, useState } from 'react';
import { useTopicsQuery } from 'services/topic/topic';
import SideBar from 'components/sideBar';
import sideBarIcon from '../../assets/aim.png';

const Home = () => {
  const t = useTranslation();
  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));
  const [logout, { isLoading }] = useLogoutMutation();
  const [createTarget, { isLoadingCreateTarget, isSuccess, error }] = useCreateTargetMutation();
  const { data: topics } = useTopicsQuery();
  const { data: targets } = useGetTargetsQuery();
  const [topicsList, setTopicsList] = useState([]);
  const [targetsList, setTargetsList] = useState([]);
  const [isTargetCreationLimit, setIsTargetCreationLimit] = useState(false);
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

  const parseTopics = () => {
    let topicsParsedList = [];
    topics?.topics.map(topic => {
      topicsParsedList.push({ id: topic.topic.id, label: topic.topic.label });
    });
    setTopicsList(topicsParsedList);
  };

  const parseTargets = () => {
    let targetsParsedList = [];
    targets?.targets.map(target => {
      targetsParsedList.push([target.target.lat, target.target.lng]);
    });
    setTargetsList(targetsParsedList);
  };

  useEffect(() => {
    parseTopics();
  }, [topics]);
  useEffect(() => {
    parseTargets();
  }, [targets]);
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

  useEffect(() => {
    setIsTargetCreationLimit(false);
  }, []);
  const onSubmit = data => {
    if (targetsList.length <= 9) {
      createTarget({ ...data, ...latLng });
    } else {
      setIsTargetCreationLimit(true);
    }
  };

  const sendLatLng = dataFromChild => {
    setLatLng(dataFromChild);
  };

  return (
    <div className="home">
      <MapView currentPosition={currentPosition} sendLatLng={sendLatLng} targets={targetsList} />
      <SideBar title={'sideBar.create.title'}>
        <img className="side-bar-header-title-icon" src={sideBarIcon} alt=""></img>
        <h3 className="side-bar-header-sub-title">CREATE NEW TARGET</h3>
        {topics ? (
          <div>
            <form className="side-bar-form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <label htmlFor="radius">{t('home.create.radius')}</label>
              <Input register={register} type="text" name="radius" />

              <label htmlFor="title">{t('home.create.title')}</label>
              <Input register={register} type="text" name="title" />

              <label htmlFor="topic_id">{t('home.create.topic')}</label>
              <ComboBox register={register} name="topic_id" dataSource={topicsList} />
              {isTargetCreationLimit ? <p>{t('target.create.alert.limit')}</p> : null}
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
