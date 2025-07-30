import axios from '@services/root.service.js';

export async function GetVotaciones() {
    try {
        const response = await axios.get('/votacion/');
        return response.data;
    } catch (error) {
        console.error('error al obtener votaciones:', error);
        throw error;
    }
}

export async function deleteVotacion(id) {
    try {
        console.log('Eliminando votación con ID:', id);
        const response = await axios.delete(`/votacion/${id}`);
        console.log('Respuesta del servidor:', response);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar votación:', error);
        throw error;
    }
}


export async function editVotacion(id, votacion) {
    try {
        console.log('=== EDITANDO VOTACIÓN ===');
        console.log('ID:', id);
        console.log('Datos a enviar:', JSON.stringify(votacion, null, 2));
        
        if (!id) {
            throw new Error('ID de votacion es requerido');
        }
        
        if (!votacion || typeof votacion !== 'object') {
            throw new Error('Datos de votacion son requeridos');
        }

        const response = await axios.put(`/votacion/${id}`, votacion);
        
        console.log('Votación editada');
        console.log('Respuesta del servidor:', response.data);
        
        return response.data;
    } catch (error) {
        console.error('error');
        console.error('Error:', error.message);
        
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        throw error;
    }
}


export async function createVotacion(votacionData) {
    try {

        const payload = {
            ...votacionData,
            votacionEstado: 'pendiente' 
        };

        console.log('Enviando a API:', payload);

        const response = await axios.post('/votacion/', payload);
        
        console.log('Respuesta del servidor:', response.data); 
        return response.data;

    } catch (error) {
        console.error('Error en createVotacion:', {
            request: error.config?.data,
            response: error.response?.data,
            message: error.message
        });
        throw error;
    }
}