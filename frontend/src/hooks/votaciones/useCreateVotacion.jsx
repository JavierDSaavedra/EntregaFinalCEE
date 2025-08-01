import { useState } from 'react';
import { createVotacion } from '@services/votaciones.service';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export const useCreateVotacion = (fetchVotaciones) => {
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const defaultTime = '09:00';

  const buildDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":");
    if (!hh || !mm) return null;
    return `${date} ${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;
  };

  const handleCreateVotacion = async () => {
    try {
      setIsCreating(true);

      const { value: formData } = await Swal.fire({
        title: 'Crear Nueva Votación',
        html: `
          <label><strong>Título:</strong></label>
          <input id="titulo" class="swal2-input" placeholder="Título (3-100 caracteres, solo letras, números y espacios)" maxlength="100" pattern="[a-zA-Z0-9\s]+" />
          <label><strong>Descripción:</strong></label>
          <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción (10-500 caracteres, solo letras, números, espacios y .,!?)" maxlength="500" pattern="[a-zA-Z0-9\s.,!?]+"></textarea>
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
            <div style="flex:1;">
              <label><strong>Fecha Inicio:</strong></label>
          <input id="fechaInicio" type="date" class="swal2-input" value="${(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}" />
            </div>
            <div style="flex:1;">
              <label><strong>Hora Inicio:</strong></label>
              <input id="horaInicio" type="time" class="swal2-input" value="${defaultTime}" />
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">
            <div style="flex:1;">
              <label><strong>Fecha Fin:</strong></label>
              <input id="fechaFin" type="date" class="swal2-input" />
            </div>
            <div style="flex:1;">
              <label><strong>Hora Fin:</strong></label>
              <input id="horaFin" type="time" class="swal2-input" value="18:00" />
            </div>
          </div>
          <div style="margin-top:10px;color:#888;font-size:0.95em;">El estado de la votación cambiará automáticamente a <b>finalizada</b> cuando pase la fecha de cierre.</div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const titulo = document.getElementById('titulo').value.trim();
          const descripcion = document.getElementById('descripcion').value.trim();
          const fechaInicio = document.getElementById('fechaInicio').value;
          const horaInicio = document.getElementById('horaInicio').value;
          const fechaFin = document.getElementById('fechaFin').value;
          const horaFin = document.getElementById('horaFin').value;

          if (!/^[a-zA-Z0-9\s]+$/.test(titulo))
            return Swal.showValidationMessage('El título solo puede contener letras, números y espacios');
          if (titulo.length < 3 || titulo.length > 100)
            return Swal.showValidationMessage('El título debe tener entre 3 y 100 caracteres');
          if (!/^[a-zA-Z0-9\s.,!?]+$/.test(descripcion))
            return Swal.showValidationMessage('La descripción contiene caracteres no permitidos');
          if (descripcion.length < 10 || descripcion.length > 500)
            return Swal.showValidationMessage('La descripción debe tener entre 10 y 500 caracteres');

          const inicio = buildDateTime(fechaInicio, horaInicio);
          const fin = buildDateTime(fechaFin, horaFin);

          if (!inicio || !fin) return Swal.showValidationMessage('Fechas inválidas');
          if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(inicio) || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(fin))
            return Swal.showValidationMessage('Formato de fecha inválido. Use YYYY-MM-DD HH:MM');
          if (new Date(fin.replace(' ', 'T')) <= new Date(inicio.replace(' ', 'T')))
            return Swal.showValidationMessage('La fecha fin debe ser posterior a la fecha inicio');
          // Solo mostrar error si la fecha de inicio es anterior a ahora
          const now = new Date();
          const start = new Date(`${inicio}:00`);
          if (start < now) return Swal.showValidationMessage('La fecha de inicio debe ser igual o posterior a la fecha y hora actual');

          // Mostrar resumen antes de confirmar
          Swal.fire({
            title: 'Resumen de votación',
            html: `
              <b>Título:</b> ${titulo}<br/>
              <b>Descripción:</b> ${descripcion}<br/>
              <b>Fecha de inicio:</b> ${inicio}<br/>
              <b>Fecha de fin:</b> ${fin}
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
              throw new Error('Creación cancelada por el usuario');
            }
          });

          return {
            votacionTitulo: titulo,
            votacionDescripcion: descripcion,
            votacionEstado: 'pendiente',
            votacionFechaInicio: inicio,
            votacionFechaFin: fin,
          };
        },
      });

      if (!formData) return;

      await createVotacion({ ...formData, votacionEstado: 'pendiente' });

      await Swal.fire({
        title: '¡Éxito!',
        text: 'Votación creada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });

      if (fetchVotaciones) await fetchVotaciones();
      navigate('/votaciones');
    } catch (error) {
      console.error('Error al crear votación:', error);
      let errorMsg = error.response?.data?.message || error.message || 'Error desconocido';
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        errorMsg += '\n' + error.response.data.details.map(d => d.message).join('\n');
      }
      await Swal.fire({
        title: 'Error',
        text: errorMsg,
        icon: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return { handleCreateVotacion, isCreating };
};

export default useCreateVotacion;
