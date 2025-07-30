import { useEffect, useState } from 'react';
import { getPreguntasByVotacion } from '@services/pregunta.service.js';
import { useNavigate, useParams } from 'react-router-dom';
import useResponderPregunta from '@hooks/preguntas/useResponderPregunta';
import { useAuth } from '@context/AuthContext';

const PreguntasResponder = () => {
  const { votacionId } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { responderPregunta, isResponding, error: respuestaError } = useResponderPregunta();
  const [respuestas, setRespuestas] = useState({});

  useEffect(() => {
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
    fetchPreguntas();
  }, [votacionId]);

  return (
    <div className="preguntas-votacion-page">
      <h2>Responde las preguntas de la votación</h2>
      <button onClick={() => navigate('/votaciones')} style={{marginBottom: 12}}>
        ← Volver a Votaciones
      </button>
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
              <th>Respuesta</th>
            </tr>
          </thead>
          <tbody>
            {preguntas.map((pregunta) => (
              <tr key={pregunta.preguntaId}>
                <td>{pregunta.preguntaTitulo}</td>
                <td>{(pregunta.opciones || []).join(', ')}</td>
                <td>
                  {(pregunta.opciones || []).map((opcion) => (
                    <button
                      key={opcion}
                      disabled={isResponding || respuestas[pregunta.preguntaId]}
                      style={{ marginRight: 8 }}
                      onClick={async () => {
                        const ok = await responderPregunta(pregunta.preguntaId, opcion, pregunta.votacionId);
                        if (ok) setRespuestas((r) => ({ ...r, [pregunta.preguntaId]: opcion }));
                      }}
                    >
                      {opcion}
                    </button>
                  ))}
                  {respuestas[pregunta.preguntaId] && (
                    <span style={{ color: 'green', marginLeft: 8 }}>
                      Respondido: {respuestas[pregunta.preguntaId]}
                    </span>
                  )}
                  {respuestaError && <span style={{ color: 'red' }}>{respuestaError}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PreguntasResponder;
