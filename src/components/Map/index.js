import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import Input from 'components/form/Input';
import { useEffect } from 'react';
import useTranslation from 'hooks/useTranslation';
import { useLoginMutation } from 'services/auth/auth';
import ComboBox from 'components/form/ComboBox';

const MapView = () => {
  const t = useTranslation();
  const topics = [
    { value: 'topic1', name: 'topic1' },
    { value: 'topic2', name: 'topic2' },
  ];
  
  const create = () => {};
  return (
    <>
      <MapContainer center={{ lat: 51.505, lng: -0.09 }} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
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
