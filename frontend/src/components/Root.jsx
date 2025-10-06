
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import InstallPWAButton from './InstallPWAButton';

function Root() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
       // console.log('Permission de notification :', permission);
      });
    }
  }, []);

return (
    <>
      <Outlet />
      <InstallPWAButton />
    </>
  );
}

export default Root;
