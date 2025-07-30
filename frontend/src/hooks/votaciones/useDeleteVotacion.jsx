import { useState } from 'react';
import { deleteVotacion } from '@services/votaciones.service';
import swal from 'sweetalert2';

export const useDeleteVotacion = (fetchVotaciones) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteVotacion = async (votacionId) => {
        try {
            setIsDeleting(true);
            

            const result = await swal.fire({
                title: '¿Estás seguro?',
                text: 'Esta acción no se puede deshacer',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                console.log('Eliminando votación ID:', votacionId);
                const response = await deleteVotacion(votacionId);
                
                console.log('Votación eliminada exitosamente:', response);
                
                // Mostrar mensaje de éxito
                await swal.fire({
                    title: 'Éxito',
                    text: 'Votación eliminada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                

                await fetchVotaciones();
            }
        } catch (error) {
            console.error('Error al eliminar la votación:', error);
            

            await swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar la votación',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setIsDeleting(false);
        }
    };

    return { handleDeleteVotacion, isDeleting };
};

export default useDeleteVotacion;