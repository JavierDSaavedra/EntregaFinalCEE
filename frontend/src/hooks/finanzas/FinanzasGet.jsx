import { useState } from 'react';
import { FinanzasGet } from '@services/finanzas.service.js';

export const useGetFinanzas = () => {
  const [finanzas, setFinanzas] = useState([]);

  const [totales, setTotales] = useState({ totalIngresos: 0, totalEgresos: 0, totalNeto: 0 });
  const fetchFinanzas = async () => {
    try {
      const data = await FinanzasGet();
      setFinanzas(Array.isArray(data.data) ? data.data : []);
      setTotales({
        totalIngresos: data.totalIngresos || 0,
        totalEgresos: data.totalEgresos || 0,
        totalNeto: data.totalNeto || 0,
      });
    } catch (error) {
      setFinanzas([]);
      setTotales({ totalIngresos: 0, totalEgresos: 0, totalNeto: 0 });
      if (error.response && error.response.status === 404) {
        alert("No tienes permisos para ver las finanzas o no existen registros.");
      } else {
        alert("Ocurrió un error al obtener los registros de finanzas.");
      }
      console.error("Error consiguiendo registros de finanzas:", error);
    }
  };

  return { finanzas, setFinanzas, fetchFinanzas, totales };
};

export default useGetFinanzas;