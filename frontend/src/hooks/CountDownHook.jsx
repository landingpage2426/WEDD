import { useEffect, useState } from 'react';
import CalculateTimeLeft from '../utils/CalculateTimeLeft';

function CountDownHook() {
  const [formData, setFormData] = useState({ dateMariage: '' });
  const [timeLeft, setTimeLeft] = useState({});

useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(CalculateTimeLeft(formData.dateMariage));
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData.dateMariage, timeLeft]);
  return { timeLeft, setTimeLeft, formData, setFormData }
}

export default CountDownHook;
