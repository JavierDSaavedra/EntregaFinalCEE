import { useEffect, useState } from 'react';
import { getPreguntasByVotacion } from '@services/pregunta.service.js';
import { GetVotaciones } from '@services/votaciones.service.js';
import { useNavigate, useParams } from 'react-router-dom';
import useResponderPregunta from '@hooks/preguntas/useResponderPregunta';
import '@styles/preguntasResponder.css';

const PreguntasResponder = () => {
  const { votacionId } = useParams();
  const navigate = useNavigate();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { responderPregunta, isResponding, error: respuestaError } = useResponderPregunta();
  const [respuestas, setRespuestas] = useState({});
  const [votacion, setVotacion] = useState(null);
  const [fechaStatus, setFechaStatus] = useState('cargando'); // 'antes', 'durante', 'despues'

  useEffect(() => {
    const fetchPreguntasYVotacion = async () => {
      setLoading(true);
      try {
        const res = await getPreguntasByVotacion(votacionId);
        setPreguntas(res.data || []);
        // Obtener la votación para las fechas
        const votacionesRes = await GetVotaciones();
        const v = (votacionesRes.data || votacionesRes).find(v => String(v.votacionId) === String(votacionId));
        setVotacion(v);
        if (v && v.votacionFechaInicio && v.votacionFechaFin) {
          const ahora = new Date();
          const inicio = new Date(v.votacionFechaInicio);
          const fin = new Date(v.votacionFechaFin);
          if (ahora < inicio) setFechaStatus('antes');
          else if (ahora > fin) setFechaStatus('despues');
          else setFechaStatus('durante');
        } else {
          setFechaStatus('durante'); // Si no hay fechas, dejar responder
        }
      } catch (e) {
        setPreguntas([]);
        setFechaStatus('durante');
      } finally {
        setLoading(false);
      }
    };
    fetchPreguntasYVotacion();
  }, [votacionId]);

  return (
    <div className="preguntas-votacion-page">
      <h2>Responde las preguntas de la votación</h2>
      <button className="preguntas-volver-btn" onClick={() => navigate('/votaciones')}>
        ← Volver a Votaciones
      </button>
      {loading ? (
        <p>Cargando preguntas...</p>
      ) : preguntas.length === 0 ? (
        <p>No hay preguntas para esta votación.</p>
      ) : fechaStatus === 'antes' ? (
        <p style={{color:'#1976d2',fontWeight:600}}>La votación aún no comienza. Podrás responder a partir de: {votacion?.votacionFechaInicio ? new Date(votacion.votacionFechaInicio).toLocaleString() : ''}</p>
      ) : fechaStatus === 'despues' ? (
        <>
          <p style={{color:'#888',fontWeight:600}}>La votación ha finalizado. Ya no es posible responder.</p>
          {votacion && votacion.votacionEstado !== 'finalizada' && (
            <p style={{color:'#b71c1c',fontWeight:600}}>Estado actualizado a: <b>finalizada</b></p>
          )}
        </>
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
                      className="pregunta-opcion-btn"
                      disabled={isResponding || respuestas[pregunta.preguntaId]}
                      onClick={async () => {
                        const ok = await responderPregunta(pregunta.preguntaId, opcion, pregunta.votacionId);
                        if (ok) setRespuestas((r) => ({ ...r, [pregunta.preguntaId]: opcion }));
                      }}
                    >
                      {opcion}
                    </button>
                  ))}
                  {respuestas[pregunta.preguntaId] && (
                    <table className="respuesta-table-visual">
                      <thead>
                        <tr>
                          <th className="respuesta-table-header">Tu Respuesta</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="respuesta-table-cell">{respuestas[pregunta.preguntaId]}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {respuestaError && respuestaError[pregunta.preguntaId] && (
                    <div className="respuesta-error-msg">{respuestaError[pregunta.preguntaId]}</div>
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

export default PreguntasResponder;
