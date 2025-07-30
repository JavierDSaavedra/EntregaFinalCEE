import axios from './root.service.js';

export async function getResultadosPregunta(preguntaId) {
  return axios.get(`/respuesta/resultados/${preguntaId}`);
}
