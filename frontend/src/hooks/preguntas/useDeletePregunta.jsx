import { useState } from 'react';
import { deletePregunta } from '@services/pregunta.service.js';
import Swal from 'sweetalert2';

const useDeletePregunta = (fetchPreguntas) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePregunta = async (preguntaId) => {
    try {
      const confirmar = await Swal.fire({
        title: '¿Eliminar pregunta?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
      if (!confirmar.isConfirmed) return;
      setIsDeleting(true);
      await deletePregunta(preguntaId);
      await Swal.fire('¡Eliminada!', 'La pregunta ha sido eliminada.', 'success');
      fetchPreguntas && fetchPreguntas();
    } catch (error) {
      await Swal.fire('Error', 'No se pudo eliminar la pregunta', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDeletePregunta, isDeleting };
};

export default useDeletePregunta;
