import axios from '@services/root.service.js';

export async function createPregunta(preguntaData) {
    try {
        const response = await axios.post('/pregunta', preguntaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear pregunta:', error);
        throw error;
    }
}

export async function getPreguntasByVotacion(votacionId) {
    try {
        const response = await axios.get(`/pregunta?votacionId=${votacionId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener preguntas:', error);
        throw error;
    }
}

export async function editPregunta(id, preguntaData) {
    try {
        const response = await axios.put(`/pregunta/${id}`, preguntaData);
        return response.data;
    } catch (error) {
        console.error('Error al editar pregunta:', error);
        throw error;
    }
}

export async function deletePregunta(id) {
    try {
        const response = await axios.delete(`/pregunta/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar pregunta:', error);
        throw error;
    }
}
