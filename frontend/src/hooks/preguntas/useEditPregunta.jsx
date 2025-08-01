import { useState } from 'react';
import { editPregunta } from '@services/pregunta.service.js';
import Swal from 'sweetalert2';

const useEditPregunta = (fetchPreguntas) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPregunta = async (pregunta) => {
    try {
      let formData = null;
      const opcionesOriginales = pregunta.opciones || ["Sí", "No"];
      const opcionesString = opcionesOriginales.join(", ");
      if (pregunta.respuestas && pregunta.respuestas.length > 0) {
        const { value } = await Swal.fire({
          title: 'Editar Título de la Pregunta',
          html: `
            <input id="titulo" class="swal2-input" placeholder="Título de la pregunta" value="${pregunta.preguntaTitulo}" />
            <small style="color:#888;font-size:0.95em;">No puedes editar las opciones porque ya existen respuestas registradas.</small>
          `,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const preguntaTitulo = document.getElementById('titulo').value.trim();
            // Permitir signo de pregunta en el título
            if (!preguntaTitulo || preguntaTitulo.length < 3) return Swal.showValidationMessage('El título es obligatorio (mínimo 3 caracteres)');
            return { preguntaTitulo };
          }
        });
        if (!value) return;
        formData = { preguntaTitulo: value.preguntaTitulo, opciones: opcionesOriginales, votacionId: pregunta.votacionId };
      } else {
        const { value } = await Swal.fire({
          title: 'Editar Pregunta',
          html: `
            <input id="titulo" class="swal2-input" placeholder="Título de la pregunta" value="${pregunta.preguntaTitulo}" />
            <input id="opciones" class="swal2-input" placeholder="Opciones separadas por coma" value="${opcionesString}" />
            <small style="color:#888;font-size:0.95em;">Ejemplo: Sí, No, Abstención, Otra opción</small>
          `,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          preConfirm: () => {
            const preguntaTitulo = document.getElementById('titulo').value.trim();
            const opcionesInput = document.getElementById('opciones').value.trim();
            if (!preguntaTitulo || preguntaTitulo.length < 3) return Swal.showValidationMessage('El título es obligatorio (mínimo 3 caracteres)');
            const opciones = opcionesInput.split(',').map(o => o.trim()).filter(o => o.length > 0);
            // Permitir ? en las opciones
            if (opciones.length < 2) return Swal.showValidationMessage('Debes ingresar al menos dos opciones.');
            return {
              preguntaTitulo,
              opciones
            };
          }
        });
        if (!value) return;
        formData = { ...value, votacionId: pregunta.votacionId };
      }
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
