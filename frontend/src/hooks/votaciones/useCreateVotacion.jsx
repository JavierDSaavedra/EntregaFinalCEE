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
    const dt = new Date(`${date}T${time}`);
    return isNaN(dt.getTime()) ? null : `${date} ${time}`;
  };

  const handleCreateVotacion = async () => {
    try {
      setIsCreating(true);

      const { value: formData } = await Swal.fire({
        title: 'Crear Nueva Votación',
        html: `
          <label><strong>Título:</strong></label>
          <input id="titulo" class="swal2-input" placeholder="Título (3-100 caracteres)" />
          <label><strong>Descripción:</strong></label>
          <textarea id="descripcion" class="swal2-textarea" placeholder="Descripción (10-500 caracteres)"></textarea>
          <label><strong>Fecha Inicio:</strong></label>
          <input id="fechaInicio" type="date" class="swal2-input" value="${new Date().toISOString().split('T')[0]}" style="width:48%; display:inline-block; margin-right:4%;" />
          <input id="horaInicio" type="time" class="swal2-input" value="${defaultTime}" style="width:48%; display:inline-block;" />
          <label><strong>Fecha Fin:</strong></label>
          <input id="fechaFin" type="date" class="swal2-input" style="width:48%; display:inline-block; margin-right:4%;" />
          <input id="horaFin" type="time" class="swal2-input" value="18:00" style="width:48%; display:inline-block;" />
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

          if (titulo.length < 3 || titulo.length > 100)
            return Swal.showValidationMessage('El título debe tener entre 3 y 100 caracteres');
          if (descripcion.length < 10 || descripcion.length > 500)
            return Swal.showValidationMessage('La descripción debe tener entre 10 y 500 caracteres');

          const inicio = buildDateTime(fechaInicio, horaInicio);
          const fin = buildDateTime(fechaFin, horaFin);

          if (!inicio || !fin) return Swal.showValidationMessage('Fechas inválidas');
          if (new Date(fin + ':00') <= new Date(inicio + ':00'))
            return Swal.showValidationMessage('La fecha fin debe ser posterior a la fecha inicio');

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
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || error.message || 'Error desconocido',
        icon: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return { handleCreateVotacion, isCreating };
};

export default useCreateVotacion;
