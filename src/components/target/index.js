import { useEffect, useState } from 'react';
import { useGetTargetMutation } from 'services/target/target';
import { Marker, useMapEvents } from 'react-leaflet';
import myIcon from '../Map/Icon';

const AddMarkerToClick = props => {
  const [targets, setTargets] = useState([]);
  const [getTargets] = useGetTargetMutation();
  useEffect(() => {
    getTargets().then(data => {
      const targetList = data.data.targets;
      for (let i = 0; i < targetList.length; i++) {
        const newTarget = {
          lat: targetList[i].target.lat,
          lng: targetList[i].target.lng,
        };
        setTargets(prevState => {
          return [...prevState, newTarget];
        });
      }
    });
  }, []);
  const map = useMapEvents({
    click(e) {
      const newTarget = e.latlng;
      setTargets([...targets, newTarget]);
      props.sendLatLng(e.latlng);
    },
  });
  return (
    <>
      {targets.map((target, index) => (
        <Marker position={target} icon={myIcon} key={index}></Marker>
      ))}
    </>
  );
};

export default AddMarkerToClick;
