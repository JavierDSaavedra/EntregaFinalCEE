import '@styles/Finanzas.css';
import { useEffect } from 'react';
import { useFinanzasCreate } from '@hooks/finanzas/FinanzasCreate.jsx';
import { useGetFinanzas } from '@hooks/finanzas/FinanzasGet.jsx';
import { useEditFinanza } from '@hooks/finanzas/FinanzasEdit.jsx';
import { useDeleteFinanza } from '@hooks/finanzas/FinanzasDelete.jsx';
import { useAuth } from '@context/AuthContext.jsx';
import Sidebar from '../components/Sidebar';


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


  const rol = (user?.role || '').toLowerCase();
  const esCEE = ["presidente", "secretario", "tesorero"].includes(rol);
  const esTesorero = rol === "tesorero";

  console.log("Render Finanzas", finanzas);
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f8fd' }}>

      <Sidebar />
      <main style={{
        flex: 1,
        padding: 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'margin-left 0.2s'
      }}>
        <div className="finanzas-page cee-bg">
          <div className="finanzas-header-container">
            <h2 className="finanzas-title">Registro de Finanzas</h2>
            <div className="finanzas-badges">
              <span className="badge-ingresos">Ingresos: ${totales.totalIngresos}</span>
              <span className="badge-egresos">Egresos: ${totales.totalEgresos}</span>
              <span className="badge-neto">Neto: ${totales.totalNeto}</span>
            </div>
          </div>

          {esCEE ? (
            <>
              {esTesorero && (
                <div className="finanzas-actions-bar">
                  <button className="finanzas-btn agregar" onClick={handleFinanzasCreate}>+ Agregar Transacción</button>
                  <button className="finanzas-btn editar" onClick={() => handleEditFinanza(finanzas)}>Editar transacción</button>
                  <button className="finanzas-btn eliminar" onClick={() => handleDeleteFinanza(finanzas)}>Eliminar transacción</button>
                </div>
              )}

              <div className="finanzas-table-container">
                <table className="finanzas-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Monto</th>
                      <th>Tipo</th>
                      <th>Fecha Ingresado</th>
                      <th>Fecha Editado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(finanzas) && finanzas.length === 0 ? (
                      <tr>
                        <td colSpan={7}>No hay transacciones disponibles</td>
                      </tr>
                    ) : (
                      finanzas.map((transaccion) => (
                        <tr key={transaccion.id}>
                          <td>{transaccion.id}</td>
                          <td>{transaccion.Nombre_Transaccion}</td>
                          <td>{transaccion.Descripcion || <span className="finanzas-desc-vacia">Sin descripción</span>}</td>
                          <td className={transaccion.Tipo_Transaccion === 'Ingreso' ? 'ingreso' : 'egreso'}>
                            ${transaccion.Monto}
                          </td>
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="finanzas-no-cee">
              <p>Solo los usuarios CEE pueden ver los registros de finanzas.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Finanzas;
