import { useState } from 'react';
import { GetEventos } from '@services/eventos.service.js';

export const useGetEventos = () => {
  const [eventos, setEventos] = useState([]);

  const fetchEventos = async () => {
    try {
      const data = await GetEventos();
      setEventos(data.data);
    } catch (error) {
      console.error('Error consiguiendo los eventos:', error);
    }
  }
  return { eventos, fetchEventos, setEventos };
}

export default useGetEventos;