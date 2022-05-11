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
import avatar from '../../assets/profile.png';
import { useProfilePasswordMutation } from 'services/profile/profile';
import { useGetConversationQuery } from 'services/conversation/conversation';
import { CONNECTION_PORT } from 'utils/socketConstants';
import { ActionCableProvider, ActionCableConsumer } from 'react-actioncable-provider';
import ActionCable from 'actioncable';

const Home = () => {
  const t = useTranslation();
  const handleLogout = () => logout().then(() => localStorage.removeItem('user'));
  const user = JSON.parse(localStorage.getItem('user'));
  const [logout, { isLoading }] = useLogoutMutation();
  const [createTarget] = useCreateTargetMutation();
  const [editProfile] = useProfilePasswordMutation();
  const { data: topics } = useTopicsQuery();
  const { data: targets } = useGetTargetsQuery();
  const [topicsList, setTopicsList] = useState([]);
  const [targetsList, setTargetsList] = useState([]);
  const [isTargetCreationLimit, setIsTargetCreationLimit] = useState(false);
  const [latLng, setLatLng] = useState({});
  const [tabSelected, setTabSelected] = useState('HOME');
  const { data: matchConversations } = useGetConversationQuery();
  const [matchList, setMatchList] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState({});
  const [chatMessage, setChatMessage] = useState();
  const cable = ActionCable.createConsumer(
    `wss://target-mvd-api.herokuapp.com/api/v1/cable?access-token=${user.token}&uid=${user.uid}`
  );
  const [profile, setProfile] = useState({
    currentPassword: '',
    password: '',
    password_confirmation: '',
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
  const getMatches = () => {
    const matches = matchConversations?.matches || [];
    setMatchList(matches);
  };

  useEffect(() => {
    getMatches();
  }, [matchConversations]);
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
  const editProfileSchema = z.object({
    current_password: z.string().min(1),
    password: z.string().min(1),
    password_confirmation: z.string().min(1),
  });
  const chatSchema = z.object({
    chatMessage: z.string().min(1),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const {
    register: editProfileForm,
    handleSubmit: handleEditProfileForm,
    formState: { editProfileErrors },
  } = useForm({ resolver: zodResolver(editProfileSchema) });

  const {
    register: chatForm,
    handleSubmit: handleChatForm,
    formState: { chatErrors },
  } = useForm({ resolver: zodResolver(chatSchema) });

  const onSubmit = data => {
    if (targetsList.length <= 9) {
      createTarget({ ...data, ...latLng });
    } else {
      if (targetsList.length > 9) setIsTargetCreationLimit(true);
    }
  };
  const sendLatLng = dataFromChild => {
    setLatLng(dataFromChild);
  };
  const switchTab = dataFromChild => {
    setTabSelected(dataFromChild);
  };
  const onSubmitEditProfile = data => {
    editProfile(data);
  };
  const handleClickOpenChat = data => {
    setSelectedMatch(data);
    setTabSelected('CHAT');
  };
  const onSubmitChatForm = data => {
    setChatMessage(data.chatMessage);
    cable.subscriptions.create('send_message', { message: chatMessage });
  };
  const handleReceivedConversation = response => {
    debugger;
    const { conversation } = response;
  };
  const handleOnConected = () => {
    debugger;
    console.log('conectado');
  };
  return (
    <div className="home">
      <MapView currentPosition={currentPosition} sendLatLng={sendLatLng} targets={targetsList} />
      <SideBar title={'sideBar.create.title'} switchTab={switchTab}>
        {(() => {
          switch (tabSelected) {
            case 'HOME':
              return (
                <>
                  <h2>{t('home.title')}</h2>
                  <img alt="profile avatar" src={avatar}></img>
                  <h5>{user.username}</h5>
                  <hr className="margin-auto"></hr>
                  <h3>{t('home.chat.title')}</h3>
                  {matchList.map((match, i) => {
                    return (
                      <>
                        <hr className="line margin-auto"></hr>
                        <button
                          className="chat_button"
                          key={i}
                          onClick={() => handleClickOpenChat(match)}
                        >
                          {match.user.full_name}
                        </button>
                        <div
                          className={
                            match.unread_messages === 0
                              ? 'notifications_empty_container'
                              : 'have_notifications_container'
                          }
                        >
                          <lable
                            className={
                              match.unread_messages === 0
                                ? 'notifications_empty'
                                : 'have_notifications'
                            }
                          >
                            {match.unread_messages}
                          </lable>
                        </div>
                      </>
                    );
                  })}
                </>
              );
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
                    <form
                      className="side-bar-form"
                      onSubmit={handleEditProfileForm(onSubmitEditProfile)}
                      noValidate
                    >
                      <label htmlFor="current_password">{t('profile.edit.currentPassword')}</label>
                      <Input type="password" register={editProfileForm} name="current_password" />
                      <label htmlFor="password">{t('profile.edit.newPassword')}</label>
                      <Input type="password" register={editProfileForm} name="password" />
                      <label htmlFor="password_confirmation">
                        {t('profile.edit.repeatPassword')}
                      </label>
                      <Input
                        type="password"
                        name="password_confirmation"
                        register={editProfileForm}
                      />
                      <Button type="submit">{t('profile.edit.saveButton')}</Button>
                    </form>
                  </div>
                </>
              );
            case 'CHAT':
              return (
                <>
                  <ActionCableProvider cable={cable}>
                    <ActionCableConsumer
                      channel={'ChatChannel'}
                      onReceived={handleReceivedConversation}
                      onConnected={handleOnConected}
                    />
                    <h5>{selectedMatch.user.full_name}</h5>
                    <hr className="line margin-auto"></hr>
                    <div className="chat-container"></div>
                    <div className="chat-box-container">
                      <form onSubmit={handleChatForm(onSubmitChatForm)}>
                        <Input type="text" name="chatMessage" register={chatForm} />
                        <Button type="submit">{t('chat.button')}</Button>
                      </form>
                    </div>
                  </ActionCableProvider>
                </>
              );
            default:
              return null;
          }
        })()}
      </SideBar>
    </div>
  );
};

export default Home;
