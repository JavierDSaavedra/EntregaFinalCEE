import axios from '@services/root.service.js';

export async function FinanzasCreate(finanzasData) {
    try {
        const response = await axios.post('/finanzas', finanzasData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el registro de finanzas:", error);
        throw error;
    }
}

export async function FinanzasGet(finanzasId) {
    try {
        const response = await axios.get(`/finanzas/${finanzasId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el registro de finanzas:", error);
        throw error;
    }
}