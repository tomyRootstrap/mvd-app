import { useEffect, useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import myIcon from '../Map/Icon';

const Target = props => {
  const [latLng, setLatLng] = useState(null);
  const mapClicked = useMapEvents({
    click(e) {
      props.sendLatLng(e.latlng);
      setLatLng([e.latlng.lat, e.latlng.lng]);
    },
  });
  useEffect(() => {}, [latLng]);
  return (
    <>
      {props.targets.map((target, index) => (
        <Marker position={target} icon={myIcon} key={index} />
      ))}
      {latLng ? <Marker position={latLng} icon={myIcon} /> : null}
    </>
  );
};

export default Target;
