import { useState } from 'react';
import { editPregunta } from '@services/pregunta.service.js';
import Swal from 'sweetalert2';

const useEditPregunta = (fetchPreguntas) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPregunta = async (pregunta) => {
    try {
      const { value: formData } = await Swal.fire({
        title: 'Editar Pregunta',
        html: `
          <input id="titulo" class="swal2-input" placeholder="Título de la pregunta" value="${pregunta.preguntaTitulo}" />
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const preguntaTitulo = document.getElementById('titulo').value.trim();
          if (!preguntaTitulo || preguntaTitulo.length < 3) return Swal.showValidationMessage('El título es obligatorio (mínimo 3 caracteres)');
          return {
            preguntaTitulo,
            opciones: ["Sí", "No"]
          };
        }
      });
      if (!formData) return;
      setIsEditing(true);
      await editPregunta(pregunta.preguntaId, formData);
      await Swal.fire('¡Éxito!', 'Pregunta editada correctamente', 'success');
      fetchPreguntas && fetchPreguntas();
    } catch (error) {
      await Swal.fire('Error', 'No se pudo editar la pregunta', 'error');
    } finally {
      setIsEditing(false);
    }
  };

  return { handleEditPregunta, isEditing };
};

export default useEditPregunta;
