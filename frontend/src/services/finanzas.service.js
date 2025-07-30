import axios from '@services/root.service.js';

export async function FinanzasEdit(identificador, finanzaData) {
    try {
        let query = '';
        if (identificador?.id) {
            query = `id=${identificador.id}`;
        } else if (identificador?.Nombre_Transaccion) {
            query = `Nombre_Transaccion=${encodeURIComponent(identificador.Nombre_Transaccion)}`;
        } else {
            throw new Error('Debes proporcionar id o Nombre_Transaccion');
        }
        const response = await axios.put(`/finanzas?${query}`, finanzaData);
        return response.data;
    } catch (error) {
        console.error("Error al editar el registro de finanzas:", error);
        throw error;
    }
}

export async function FinanzasDelete(identificador) {
    try {
        let query = '';
        if (identificador?.id) {
            query = `id=${identificador.id}`;
        } else if (identificador?.Nombre_Transaccion) {
            query = `Nombre_Transaccion=${encodeURIComponent(identificador.Nombre_Transaccion)}`;
        } else {
            throw new Error('Debes proporcionar id o Nombre_Transaccion');
        }
        const response = await axios.delete(`/finanzas?${query}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el registro de finanzas:", error);
        throw error;
    }
}

export async function FinanzasGet() {
    try {
        const response = await axios.get('/finanzas');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los registros de finanzas:", error);
        throw error;
    }
}

export async function FinanzasCreate(finanzasData) {
    try {
        const response = await axios.post('/finanzas', finanzasData);
        return response.data;
    } catch (error) {
        console.error("Error al crear el registro de finanzas:", error);
        throw error;
    }
}

