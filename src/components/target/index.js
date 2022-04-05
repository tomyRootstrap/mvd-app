import { useState } from 'react';

import { Marker, useMapEvents } from 'react-leaflet';
import myIcon from '../Map/Icon';

const AddMarkerToClick = props => {
  const map = useMapEvents({
    click(e) {
      props.targets.push(e.latlng);
      props.sendLatLng(e.latlng);
    },
  });
  return (
    <>
      {props.targets.map((target, index) => (
        <Marker position={target} icon={myIcon} key={index}></Marker>
      ))}
    </>
  );
};

export default AddMarkerToClick;
