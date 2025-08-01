import { useState } from 'react';
import { responderPreguntaService } from '@services/respuesta.service.js';

export default function useResponderPregunta() {
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState({});

  const responderPregunta = async (preguntaId, respuesta, votacionId) => {
    setIsResponding(true);
    setError((prev) => ({ ...prev, [preguntaId]: null }));
    try {
      await responderPreguntaService({ preguntaId, respuesta, votacionId });
      setIsResponding(false);
      return true;
    } catch (e) {
      setError((prev) => ({ ...prev, [preguntaId]: e.response?.data?.message || 'Error al responder' }));
      setIsResponding(false);
      return false;
    }
  };

  return { responderPregunta, isResponding, error };
}
