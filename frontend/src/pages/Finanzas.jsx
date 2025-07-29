import '@styles/Finanzas.css';
import React, { useEffect } from 'react';
import { useFinanzasCreate } from '@hooks/finanzas/FinanzasCreate.jsx';
import {useGetFinanzas} from '@hooks/finanzas/FinanzasGet.jsx';

const Finanzas = () => {
    const { finanzas, fetchFinanzas } = useGetFinanzas();
    const { handleFinanzasCreate } = useFinanzasCreate(fetchFinanzas);


    useEffect(() => {
        fetchFinanzas();
        console.log(finanzas)
    }, []);


  return (
    <div className="finanzas-page">
      <h2>Registro de Finanzas</h2>
      <table className= "finanzas-actions">
        <thead>
          <tr>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
            <button className="Agregar" onClick={handleFinanzasCreate}>Agregar Transacción</button>
            <button className="Editar">Editar transacción</button>
            <button className="Eliminar">Eliminar transacción</button>
            <button className="Ver Registro" onClick={() => useGetFinanzas(finanzas.id)}>Ver Registro</button>
            </td>
          </tr>
        </tbody>
      </table>  
      

      <table className="finanzas-table">
        <thead>
          <tr>
            <th>Nombre_Transaccion</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Tipo_Transaccion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(finanzas) && finanzas.length === 0 ? (
          <tr>
            <td colSpan="5">No hay transacciones disponibles</td>
          </tr>
        ) : (
          finanzas.map((transaccion) => (
            <tr key={transaccion.id}>
              <td>{transaccion.nombre}</td>
              <td>{transaccion.descripcion}</td>
              <td>{transaccion.monto}</td>
              <td>{transaccion.tipo}</td>
              <td>
                <button className="edit">Editar</button>
                <button className="delete">Eliminar</button>
              </td>
            </tr>
          )) )}
        </tbody>
      </table>
    </div>
  )
}

export default Finanzas;
