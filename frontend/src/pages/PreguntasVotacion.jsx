import { useEffect, useState } from 'react';
import { getPreguntasByVotacion } from '@services/pregunta.service.js';
import useEditPregunta from '@hooks/preguntas/useEditPregunta';
import useDeletePregunta from '@hooks/preguntas/useDeletePregunta';
import useCreatePregunta from '@hooks/preguntas/useCreatePregunta';

import useResponderPregunta from '@hooks/preguntas/useResponderPregunta';
import { getResultadosPregunta } from '@services/respuesta.service.js';
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
  }, [votacionId]);

  return (
    <div className="preguntas-votacion-page">
      <h2 className="preguntas-votacion-title">Preguntas de la Votación</h2>
      <div className="preguntas-actions">
        <button className="preguntas-volver-btn" onClick={() => navigate('/votaciones')}>
          ← Volver a Votaciones
        </button>
        {user && ["presidente", "secretario", "tesorero"].includes(user.role) && (
          <button className="preguntas-crear-btn" onClick={() => handleCreatePregunta(Number(votacionId))} disabled={isCreating}>
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
                        className="preguntas-resultados-btn"
                        onClick={() => fetchResultados(pregunta.preguntaId)}
                        disabled={loadingResultados[pregunta.preguntaId]}
                      >
                        {loadingResultados[pregunta.preguntaId] ? 'Cargando...' : 'Ver resultados'}
                      </button>
                      {resultados[pregunta.preguntaId] && resultados[pregunta.preguntaId].success && resultados[pregunta.preguntaId].data && (
                        <table className="respuesta-table-visual preguntas-resultados-table">
                          <thead>
                            <tr>
                              <th>Opción</th>
                              <th>Votos</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(resultados[pregunta.preguntaId].data).map(([opcion, votos]) => (
                              <tr key={opcion}>
                                <td>{opcion}</td>
                                <td>{typeof votos === 'object' ? JSON.stringify(votos) : votos}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      {resultados[pregunta.preguntaId] && resultados[pregunta.preguntaId].success === false && resultados[pregunta.preguntaId].error && (
                        <div className="preguntas-resultados-error">{resultados[pregunta.preguntaId].error}</div>
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
                          className="pregunta-opcion-btn"
                          disabled={isResponding || respuestas[pregunta.preguntaId]}
                          onClick={async () => {
                            const ok = await responderPregunta(pregunta.preguntaId, opcion);
                            if (ok) setRespuestas((r) => ({ ...r, [pregunta.preguntaId]: opcion }));
                          }}
                        >
                          {opcion}
                        </button>
                      ))}
                      {respuestas[pregunta.preguntaId] && (
                        <span className="pregunta-respondido">Respondido: {respuestas[pregunta.preguntaId]}</span>
                      )}
                      {respuestaError && <span className="pregunta-respuesta-error">{respuestaError}</span>}
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
