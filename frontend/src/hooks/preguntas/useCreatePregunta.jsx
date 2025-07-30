import { useState } from 'react';
import { createPregunta } from '@services/pregunta.service.js';
import Swal from 'sweetalert2';

export const useCreatePregunta = (fetchPreguntas) => {
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePregunta = async (votacionId) => {
        try {
            const { value: formData } = await Swal.fire({
                title: 'Crear Pregunta',
                html: `
                  <input id="titulo" class="swal2-input" placeholder="Título de la pregunta" />
                `,
                showCancelButton: true,
                confirmButtonText: 'Crear',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const preguntaTitulo = document.getElementById('titulo').value.trim();
                    if (!preguntaTitulo || preguntaTitulo.length < 3) return Swal.showValidationMessage('El título es obligatorio (mínimo 3 caracteres)');
                    return {
                        preguntaTitulo,
                        opciones: ["Sí", "No"],
                        votacionId
                    };
                }
            });
            if (!formData) return;
            setIsCreating(true);
            await createPregunta(formData);
            await Swal.fire('¡Éxito!', 'Pregunta creada correctamente', 'success');
            fetchPreguntas && fetchPreguntas();
        } catch (error) {
            await Swal.fire('Error', 'No se pudo crear la pregunta', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    return { handleCreatePregunta, isCreating };
};

export default useCreatePregunta;
