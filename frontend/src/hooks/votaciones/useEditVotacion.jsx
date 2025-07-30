import { useState } from 'react';
import { editVotacion } from '@services/votaciones.service';
import Swal from 'sweetalert2';

export const useEditVotacion = (fetchVotaciones) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? '' : date.toISOString().split('T')[0];
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? '09:00' : date.toTimeString().slice(0, 5);
  };

  const toBackendDate = (date, time) => {
    if (!date || !time) return null;
    const combined = `${date} ${time}`;
    const valid = new Date(`${combined}:00`);
    return isNaN(valid) ? null : combined;
  };

  const handleEditVotacion = async (id, actual) => {
    try {
      setIsEditing(true);

      const { value: formData } = await Swal.fire({
        title: 'Editar Votación',
        html: `
          <input id="titulo" class="swal2-input" placeholder="Título" value="${actual?.votacionTitulo || ''}">
          <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción">${actual?.votacionDescripcion || ''}</textarea>
          <input id="fechaInicio" type="date" class="swal2-input" value="${formatDate(actual?.votacionFechaInicio)}">
          <input id="horaInicio" type="time" class="swal2-input" value="${formatTime(actual?.votacionFechaInicio)}">
          <input id="fechaFin" type="date" class="swal2-input" value="${formatDate(actual?.votacionFechaFin)}">
          <input id="horaFin" type="time" class="swal2-input" value="${formatTime(actual?.votacionFechaFin)}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const titulo = document.getElementById('titulo').value.trim();
          const descripcion = document.getElementById('descripcion').value.trim();
          const fechaInicio = toBackendDate(
            document.getElementById('fechaInicio').value,
            document.getElementById('horaInicio').value
          );
          const fechaFin = toBackendDate(
            document.getElementById('fechaFin').value,
            document.getElementById('horaFin').value
          );

          if (titulo.length < 3 || titulo.length > 100) return Swal.showValidationMessage('Título inválido');
          if (descripcion.length < 10 || descripcion.length > 500) return Swal.showValidationMessage('Descripción inválida');
          if (!fechaInicio) return Swal.showValidationMessage('Fecha de inicio inválida');
          if (!fechaFin) return Swal.showValidationMessage('Fecha de fin inválida');

          const start = new Date(`${fechaInicio}:00`);
          const end = new Date(`${fechaFin}:00`);

          if (end <= start) return Swal.showValidationMessage('La fecha fin debe ser posterior a la de inicio');

          return {
            votacionTitulo: titulo,
            votacionDescripcion: descripcion,
            votacionFechaInicio: fechaInicio,
            votacionFechaFin: fechaFin
          };
        }
      });

      if (!formData) return;

      await editVotacion(id, formData);

      await Swal.fire({
        title: '¡Éxito!',
        text: 'Votación actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      fetchVotaciones && fetchVotaciones();
    } catch (error) {
      let msg = 'Ocurrió un error al actualizar la votación';
      const data = error.response?.data;

      if (data?.details?.length) {
        msg = data.details
          .map((d) => `• ${d.field || d.path?.[0] || 'Campo'}: ${d.message || 'Error'}`)
          .join('\n');
      } else if (data?.message) {
        msg = data.message;
      }

      await Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsEditing(false);
    }
  };

  return { handleEditVotacion, isEditing };
};

export default useEditVotacion;
