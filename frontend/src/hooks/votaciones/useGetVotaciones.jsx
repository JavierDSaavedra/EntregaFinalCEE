import { useState } from 'react';
import { GetVotaciones } from '@services/votaciones.service.js';

export const useGetVotaciones = () => {
    const [votaciones, setVotaciones] = useState([])

    const fetchVotaciones = async () => {
        try {
            const data = await GetVotaciones();
            setVotaciones(data.data);
        } catch (error) {
            console.error('Error al conseguir las votaciones:', error);
        }
    }
        return { votaciones, fetchVotaciones, setVotaciones}
}

export default useGetVotaciones;