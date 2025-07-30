import axios from '@services/root.service.js';

export async function getUsersByGeneracion(generacion) {
  try {
    const response = await axios.get(`/users/generacion/${generacion}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al buscar usuarios por generación:', error);
    return [];
  }
}
