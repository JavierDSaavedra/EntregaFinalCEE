import { useEffect, useState } from 'react';
import { getPreguntasByVotacion } from '@services/pregunta.service.js';
import useEditPregunta from '@hooks/preguntas/useEditPregunta';
import useDeletePregunta from '@hooks/preguntas/useDeletePregunta';
import useCreatePregunta from '@hooks/preguntas/useCreatePregunta';

import useResponderPregunta from '@hooks/preguntas/useResponderPregunta';
import { getResultadosPregunta } from '@services/resultados.service.js';
import '@styles/preguntasVotacion.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const PreguntasVotacion = () => {
  const { votacionId } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { responderPregunta, isResponding, error: respuestaError } = useResponderPregunta();
  const [respuestas, setRespuestas] = useState({});
  const [resultados, setResultados] = useState({});
  const [loadingResultados, setLoadingResultados] = useState({});

  // Fetch results for a specific pregunta, with error handling
  const fetchResultados = async (preguntaId) => {
    setLoadingResultados((prev) => ({ ...prev, [preguntaId]: true }));
    try {
      const res = await getResultadosPregunta(preguntaId);
      setResultados((prev) => ({ ...prev, [preguntaId]: { success: true, data: res.data } }));
    } catch (e) {
      setResultados((prev) => ({ ...prev, [preguntaId]: { success: false, error: 'Error al obtener resultados' } }));
    } finally {
      setLoadingResultados((prev) => ({ ...prev, [preguntaId]: false }));
    }
  };

  const fetchPreguntas = async () => {
    setLoading(true);
    try {
      const res = await getPreguntasByVotacion(votacionId);
      setPreguntas(res.data || []);
    } catch (e) {
      setPreguntas([]);
    } finally {
      setLoading(false);
    }
  };

  const { handleEditPregunta, isEditing } = useEditPregunta(fetchPreguntas);
  const { handleDeletePregunta, isDeleting } = useDeletePregunta(fetchPreguntas);
  const { handleCreatePregunta, isCreating } = useCreatePregunta(fetchPreguntas);

  useEffect(() => {
    fetchPreguntas();
    // eslint-disable-next-line
  }, [votacionId]);

  return (
    <div className="preguntas-votacion-page">
      <h2 style={{ color: '#512da8', marginBottom: 18 }}>Preguntas de la Votación</h2>
      <div className="preguntas-actions" style={{ marginBottom: 18, display: 'flex', alignItems: 'center' }}>
        <button onClick={() => navigate('/votaciones')} style={{marginBottom: 0}}>
          ← Volver a Votaciones
        </button>
        {user && ["presidente", "secretario", "tesorero"].includes(user.role) && (
          <button onClick={() => handleCreatePregunta(Number(votacionId))} disabled={isCreating} style={{marginLeft: 8}}>
            {isCreating ? 'Creando...' : '+ Añadir Pregunta'}
          </button>
        )}
      </div>
      {loading ? (
        <p>Cargando preguntas...</p>
      ) : preguntas.length === 0 ? (
        <p>No hay preguntas para esta votación.</p>
      ) : (
        <table className="preguntas-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Opciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {preguntas.map((pregunta) => (
              <tr key={pregunta.preguntaId}>
                <td>{pregunta.preguntaTitulo}</td>
                <td>
                  {(pregunta.opciones || []).map((op, idx) => (
                    <span key={op} className={op.toLowerCase() === 'sí' ? 'si' : op.toLowerCase() === 'no' ? 'no' : ''}>
                      {op}{idx < (pregunta.opciones.length - 1) ? ', ' : ''}
                    </span>
                  ))}
                  {user && ["presidente", "secretario", "tesorero"].includes(user.role) && (
                    <>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => fetchResultados(pregunta.preguntaId)}
                        disabled={loadingResultados[pregunta.preguntaId]}
                      >
                        {loadingResultados[pregunta.preguntaId] ? 'Cargando...' : 'Ver resultados'}
                      </button>
                      {resultados[pregunta.preguntaId] && resultados[pregunta.preguntaId].success && resultados[pregunta.preguntaId].data !== undefined && resultados[pregunta.preguntaId].data !== null && (
                        <div style={{ marginTop: 4, fontSize: 13 }}>
                          {Object.keys(resultados[pregunta.preguntaId].data).length === 0 ? (
                            <div>No hay votos registrados aún.</div>
                          ) : (
                            Object.entries(resultados[pregunta.preguntaId].data).map(([op, count]) => (
                              <div key={op} style={{ color: op.toLowerCase() === 'sí' ? '#2e7d32' : op.toLowerCase() === 'no' ? '#c62828' : '#512da8' }}>
                                {op}: <b>{typeof count === 'object' ? JSON.stringify(count) : count}</b>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      {resultados[pregunta.preguntaId] && resultados[pregunta.preguntaId].success === false && resultados[pregunta.preguntaId].error && (
                        <div style={{ color: 'red', fontSize: 13 }}>{resultados[pregunta.preguntaId].error}</div>
                      )}
                    </>
                  )}
                </td>
                <td>
                  {user && ["presidente", "secretario", "tesorero"].includes(user.role) ? (
                    <>
                      <button className="Editar" onClick={() => handleEditPregunta(pregunta)} disabled={isEditing}>
                        Editar
                      </button>
                      <button className="Eliminar" onClick={() => handleDeletePregunta(pregunta.preguntaId)} disabled={isDeleting}>
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <>
                      {(pregunta.opciones || []).map((opcion) => (
                        <button
                          key={opcion}
                          disabled={isResponding || respuestas[pregunta.preguntaId]}
                          style={{ marginRight: 8 }}
                          onClick={async () => {
                            const ok = await responderPregunta(pregunta.preguntaId, opcion);
                            if (ok) setRespuestas((r) => ({ ...r, [pregunta.preguntaId]: opcion }));
                          }}
                        >
                          {opcion}
                        </button>
                      ))}
                      {respuestas[pregunta.preguntaId] && (
                        <span style={{ color: '#2e7d32', marginLeft: 8, fontWeight: 500 }}>
                          Respondido: {respuestas[pregunta.preguntaId]}
                        </span>
                      )}
                      {respuestaError && <span style={{ color: 'red' }}>{respuestaError}</span>}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PreguntasVotacion;
