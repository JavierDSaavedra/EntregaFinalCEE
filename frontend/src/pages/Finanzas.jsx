
import '@styles/Finanzas.css';
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useFinanzasCreate } from '@hooks/finanzas/FinanzasCreate.jsx';
import { useGetFinanzas } from '@hooks/finanzas/FinanzasGet.jsx';
import { useEditFinanza } from '@hooks/finanzas/FinanzasEdit.jsx';
import { useDeleteFinanza } from '@hooks/finanzas/FinanzasDelete.jsx';
import { useAuth } from '@context/AuthContext.jsx';


const Finanzas = () => {
    const { finanzas, fetchFinanzas, totales } = useGetFinanzas();
    const { handleFinanzasCreate } = useFinanzasCreate(fetchFinanzas);
    const { handleEditFinanza } = useEditFinanza(fetchFinanzas);
    const { handleDeleteFinanza } = useDeleteFinanza(fetchFinanzas);
    const { user } = useAuth();


    useEffect(() => {
        console.log("Finanzas montado");
        fetchFinanzas();
    }, []);


  // Solo mostrar registros si el usuario es CEE
  const rol = (user?.role || '').toLowerCase();
  const esCEE = ["presidente", "secretario", "tesorero"].includes(rol);
  const esTesorero = rol === "tesorero";

  console.log("Render Finanzas", finanzas);
  return (
    <div className="finanzas-page">
      <h2>Registro de Finanzas</h2>

      {/* Mostrar totales en una tabla bonita */}
      <table className="finanzas-totales-table">
        <thead>
          <tr>
            <th>Total Ingresos</th>
            <th>Total Egresos</th>
            <th>Total Neto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="ingresos">${totales.totalIngresos}</td>
            <td className="egresos">${totales.totalEgresos}</td>
            <td className="neto">${totales.totalNeto}</td>
          </tr>
        </tbody>
      </table>

      {esCEE ? (
        <>
          {esTesorero && (
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
                    <button className="Editar" onClick={() => handleEditFinanza(finanzas)}>Editar transacción</button>
                    <button className="Eliminar" onClick={() => handleDeleteFinanza(finanzas)}>Eliminar transacción</button>
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <table className="finanzas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre_Transaccion</th>
                <th>Descripción (opcional)</th>
                <th>Monto</th>
                <th>Tipo_Transaccion</th>
                <th>Fecha Ingresado</th>
                <th>Fecha Editado</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(finanzas) && finanzas.length === 0 ? (
              <tr>
                <td colSpan="7">No hay transacciones disponibles</td>
              </tr>
            ) : (
              finanzas.map((transaccion) => (
                <tr key={transaccion.id}>
                  <td>{transaccion.id}</td>
                  <td>{transaccion.Nombre_Transaccion}</td>
                  <td>{transaccion.Descripcion || <span style={{color:'#aaa'}}>Sin descripción</span>}</td>
                  <td>{transaccion.Monto}</td>
                  <td>
                    {transaccion.Tipo_Transaccion === 'Ingreso' ? (
                      <span className="ingreso">Ingreso</span>
                    ) : transaccion.Tipo_Transaccion === 'Egreso' ? (
                      <span className="egreso">Egreso</span>
                    ) : (
                      transaccion.Tipo_Transaccion
                    )}
                  </td>
                  <td>{transaccion.Fecha_Ingresado ? new Date(transaccion.Fecha_Ingresado).toLocaleString() : '-'}</td>
                  <td>{transaccion.Fecha_Actualizado ? new Date(transaccion.Fecha_Actualizado).toLocaleString() : '-'}</td>
                </tr>
              )) )}
            </tbody>
          </table>
        </>
      ) : (
        <div className="finanzas-no-cee">
          <p>Solo los usuarios CEE pueden ver los registros de finanzas.</p>
        </div>
      )}
    </div>
  )
}

export default Finanzas;
