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
import { useProfilePasswordMutation } from 'services/profile/profile';

const Home = () => {
  const t = useTranslation();
  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));
  const [logout, { isLoading }] = useLogoutMutation();
  const [createTarget] = useCreateTargetMutation();
  const [editProfile] = useProfilePasswordMutation();
  const { data: topics } = useTopicsQuery();
  const { data: targets } = useGetTargetsQuery();
  const [topicsList, setTopicsList] = useState([]);
  const [targetsList, setTargetsList] = useState([]);
  const [isTargetCreationLimit, setIsTargetCreationLimit] = useState(false);
  const [latLng, setLatLng] = useState({});
  const [tabSelected, setTabSelected] = useState('CREATE_TARGET');
  const [profile, setProfile] = useState({
    currentPassword: null,
    password: null,
    repeatPassword: null,
  });
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

  const onSubmit = data => {
    if (targetsList.length <= 9) {
      createTarget({ ...data, ...latLng });
    } else {
      if (targetsList.length > 9) setIsTargetCreationLimit(true);
    }
  };

  const onSubmitEditProfile = () => {
    editProfile(profile)
      .then(data => {
        console.log(data);
        debugger;
      })
      .catch(error => {
        console.log(error);
      });
  };

  const sendLatLng = dataFromChild => {
    setLatLng(dataFromChild);
  };
  const switchTab = dataFromChild => {
    setTabSelected(dataFromChild);
  };
  return (
    <div className="home">
      <MapView currentPosition={currentPosition} sendLatLng={sendLatLng} targets={targetsList} />
      <SideBar title={'sideBar.create.title'} switchTab={switchTab}>
        {(() => {
          switch (tabSelected) {
            case 'CREATE_TARGET':
              return (
                <>
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
                        <Button type="submit">{t('home.create.saveTarget')}</Button>
                      </form>
                    </div>
                  ) : null}
                </>
              );
            case 'EDIT_PROFILE':
              return (
                <>
                  <img className="side-bar-header-title-icon" src={sideBarIcon} alt=""></img>
                  <h3 className="side-bar-header-sub-title">{t('profile.edit.title')}</h3>
                  <div>
                    <form className="side-bar-form" onSubmit={onSubmitEditProfile} noValidate>
                      <label htmlFor="currentPassword">{t('profile.edit.currentPassword')}</label>
                      <input
                        type="password"
                        value={profile.currentPassword}
                        name="currentPassword"
                        onChange={e =>
                          setProfile(prevState => {
                            return {
                              ...prevState,
                              currentPassword: e.target.value,
                            };
                          })
                        }
                      />
                      <label htmlFor="password">{t('profile.edit.newPassword')}</label>
                      <input
                        type="password"
                        value={profile.password}
                        onChange={e =>
                          setProfile(prevState => {
                            return {
                              ...prevState,
                              password: e.target.value,
                            };
                          })
                        }
                      />
                      <label htmlFor="password_confirmation">
                        {t('profile.edit.repeatPassword')}
                      </label>
                      <input
                        type="password"
                        name="password_confirmation"
                        value={profile.repeatPassword}
                        onChange={e =>
                          setProfile(prevState => {
                            return {
                              ...prevState,
                              repeatPassword: e.target.value,
                            };
                          })
                        }
                      />
                      <Button type="submit">{t('profile.edit.saveButton')}</Button>
                    </form>
                  </div>
                </>
              );
            default:
              return null;
          }
        })()}
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
