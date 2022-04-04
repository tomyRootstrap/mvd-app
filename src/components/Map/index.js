import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';
import myIcon from './Icon';
import { useState } from 'react';

const AddMarkerToClick = props => {
  const [markers, setMarkers] = useState([]);

  const map = useMapEvents({
    click(e) {
      const newMarker = e.latlng;
      setMarkers([...markers, newMarker]);
      props.sendLatLng(e.latlng);
    },
  });
  return (
    <>
      {markers.map((marker, index) => (
        <Marker position={marker} icon={myIcon} key={index}></Marker>
      ))}
    </>
  );
};

const MapView = props => {
  return (
    <>
      {props.currentPosition.where?.length === 2 ? (
        <MapContainer center={props.currentPosition.where} zoom="20" scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddMarkerToClick sendLatLng={props.sendLatLng} />
          <Marker position={props.currentPosition.where} icon={myIcon}></Marker>
        </MapContainer>
      ) : null}
    </>
  );
};

export default MapView;
