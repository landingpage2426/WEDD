import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import InstallPWAButton from './InstallPWAButton';
import { enforceSession } from '../utils/authSession';

function Root() {
  const location = useLocation();

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
       // console.log('Permission de notification :', permission);
      });
    }
  }, []);

  useEffect(() => {
    enforceSession();
    const intervalId = setInterval(enforceSession, 15000);
    const onFocus = () => enforceSession();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, [location.pathname]);

  return (
    <>
      <Outlet />
      <InstallPWAButton />
    </>
  );
}

export default Root;
