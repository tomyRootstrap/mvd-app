import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import Input from 'components/form/Input';
import useTranslation from 'hooks/useTranslation';
import { useLoginMutation } from 'services/auth/auth';
import ComboBox from 'components/form/ComboBox';
import { useEffect, useState } from 'react';
import myIcon from './Icon';
import { useCreateTargetMutation } from 'services/target/target';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const MapView = () => {
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

  const [createTarget, { isLoading, isSuccess, error }] = useCreateTargetMutation();
  const t = useTranslation();
  const topics = [
    { value: 'topic1', name: 'topic1' },
    { value: 'topic2', name: 'topic2' },
  ];

  const schema = z.object({
    area: z.string().min(1),
    markTitle: z.string().min(1),
    topic: z.string().min(1),
  });

  const {
    create,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

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
        <form onSubmit={handleSubmit(createTarget)}>
          <label htmlFor="area">{t('home.create.area')}</label>
          <Input register={create} type="text" name="area" />
          <label htmlFor="markTitle">{t('home.create.markTitle')}</label>
          <Input register={create} type="text" name="markTitle" />
          <label htmlFor="topic">{t('home.create.topic')}</label>
          <ComboBox register={create} name="topic" dataSource={topics} />
        </form>
      </div>
    </>
  );
};

export default MapView;
