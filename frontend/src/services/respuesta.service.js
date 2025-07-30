import axios from './root.service.js';

export async function responderPreguntaService({ preguntaId, respuesta, votacionId }) {
  return axios.post(`/respuesta`, { preguntaId, respuestaContenido: respuesta, votacionId });
}

export async function getRespuestasByUserService() {
  return axios.get(`/respuestas/mis-respuestas`);
}
