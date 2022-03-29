import L from 'leaflet';
import marker from '../../assets/marker.svg';
const myIcon = new L.icon({
  iconUrl: marker,
  iconSize: [40, 40],
  iconAnchor: [17, 46],
});

export default myIcon;
