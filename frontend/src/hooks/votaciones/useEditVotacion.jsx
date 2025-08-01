import { useState } from 'react';
import { editVotacion } from '@services/votaciones.service';
import Swal from 'sweetalert2';

export const useEditVotacion = (fetchVotaciones) => {
  const [isEditing, setIsEditing] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // Si ya viene en formato YYYY-MM-DD, úsalo directo
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // Si viene con hora, extrae solo la fecha local
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
          <label><strong>Título:</strong></label>
          <input id="titulo" class="swal2-input" placeholder="Título" value="${actual?.votacionTitulo || ''}">
          <label><strong>Descripción:</strong></label>
          <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción">${actual?.votacionDescripcion || ''}</textarea>
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
            <div style="flex:1;">
              <label><strong>Fecha Inicio:</strong></label>
              <input id="fechaInicio" type="date" class="swal2-input" value="${formatDate(actual?.votacionFechaInicio)}">
            </div>
            <div style="flex:1;">
              <label><strong>Hora Inicio:</strong></label>
              <input id="horaInicio" type="time" class="swal2-input" value="${formatTime(actual?.votacionFechaInicio)}">
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
            <div style="flex:1;">
              <label><strong>Fecha Fin:</strong></label>
              <input id="fechaFin" type="date" class="swal2-input" value="${formatDate(actual?.votacionFechaFin)}">
            </div>
            <div style="flex:1;">
              <label><strong>Hora Fin:</strong></label>
              <input id="horaFin" type="time" class="swal2-input" value="${formatTime(actual?.votacionFechaFin)}">
            </div>
          </div>
          <div style="margin-top:10px;color:#888;font-size:0.95em;">El estado de la votación cambiará automáticamente a <b>finalizada</b> cuando pase la fecha de cierre.</div>
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
          const now = new Date();

          if (end <= start) return Swal.showValidationMessage('La fecha fin debe ser posterior a la de inicio');
          // Solo mostrar error si la fecha de inicio es anterior a ahora
          if (start < now) return Swal.showValidationMessage('La fecha de inicio debe ser igual o posterior a la fecha y hora actual');

          // Mostrar resumen antes de confirmar
          Swal.fire({
            title: 'Resumen de cambios',
            html: `
              <b>Título:</b> ${titulo}<br/>
              <b>Descripción:</b> ${descripcion}<br/>
              <b>Fecha de inicio:</b> ${fechaInicio}<br/>
              <b>Fecha de fin:</b> ${fechaFin}
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Volver',
            focusConfirm: false
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            } else {
              throw new Error('Edición cancelada por el usuario');
            }
          });

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
