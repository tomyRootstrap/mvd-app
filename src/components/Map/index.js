import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import myIcon from './Icon';
import AddMarkerToClick from '../target/index';

const MapView = props => {
  return (
    <>
      {props.currentPosition.where?.length === 2 ? (
        <MapContainer center={props.currentPosition.where} zoom="20" scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddMarkerToClick sendLatLng={props.sendLatLng} targets={props.targets} />
          <Marker position={props.currentPosition.where} icon={myIcon}></Marker>
        </MapContainer>
      ) : null}
    </>
  );
};

export default MapView;
