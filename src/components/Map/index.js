import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import Input from 'components/form/Input';
import useTranslation from 'hooks/useTranslation';
import { useLoginMutation } from 'services/auth/auth';
import ComboBox from 'components/form/ComboBox';
import { useEffect, useState } from 'react';
import myIcon from './Icon';

const MapView = () => {
  const t = useTranslation();
  const topics = [
    { value: 'topic1', name: 'topic1' },
    { value: 'topic2', name: 'topic2' },
  ];
  const create = () => {};
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

  return (
    <>
      {currentPosition.where?.length === 2 ? (
        <MapContainer center={currentPosition.where} zoom="20" scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentPosition.where} icon={myIcon} />
        </MapContainer>
      ) : null}
      <div>
        <form onSubmit={create()}>
          <label htmlFor="area">{t('home.create.area')}</label>
          <Input register={createMark} type="text" name="area" />
          <label htmlFor="markTitle">{t('home.create.markTitle')}</label>
          <Input register={createMark} type="text" name="markTitle" />
          <label htmlFor="topic">{t('home.create.topic')}</label>
          <ComboBox register={createMark} name="topic" dataSource={topics} />
        </form>
      </div>
    </>
  );
};

export default MapView;
