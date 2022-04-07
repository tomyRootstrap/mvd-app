import { useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import myIcon from '../Map/Icon';

const Target = ({ sendLatLng, targets }) => {
  const [latLng, setLatLng] = useState(null);
  const mapClicked = useMapEvents({
    click(e) {
      sendLatLng(e.latlng);
      setLatLng([e.latlng.lat, e.latlng.lng]);
    },
  });
  useEffect(() => {}, [latLng]);
  return (
    <>
      {targets.map((target, index) => (
        <Marker position={target} icon={myIcon} key={index} />
      ))}
      {latLng ? <Marker position={latLng} icon={myIcon} /> : null}
    </>
  );
};

export default Target;
