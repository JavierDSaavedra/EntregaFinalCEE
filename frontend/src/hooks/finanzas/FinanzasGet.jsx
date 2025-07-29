import { useState } from 'react';
import { FinanzasGet } from '@services/finanzas.service.js';

export const useGetFinanzas = () => {
  const [finanzas, setFinanzas] = useState([]);

  const fetchFinanzas = async () => {
    try {
      const data = await FinanzasGet();
      setFinanzas(data);
    } catch (error) {
      console.error("Error consiguiendo registros de finanzas:", error);
    }
  };

  return { finanzas, setFinanzas, fetchFinanzas };
};

export default useGetFinanzas;