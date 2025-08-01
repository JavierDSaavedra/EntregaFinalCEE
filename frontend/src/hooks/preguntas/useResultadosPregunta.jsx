import { useState } from 'react';
import { getResultadosPregunta } from '@services/respuesta.service.js';

export default function useResultadosPregunta() {
  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResultados = async (preguntaId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getResultadosPregunta(preguntaId);
      setResultados(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Error al obtener resultados');
    } finally {
      setLoading(false);
    }
  };

  return { resultados, loading, error, fetchResultados };
}
