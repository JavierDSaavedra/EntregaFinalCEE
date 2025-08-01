import { useState } from 'react';
import { createPregunta } from '@services/pregunta.service.js';
import Swal from 'sweetalert2';

export const useCreatePregunta = (fetchPreguntas) => {
    const [isCreating, setIsCreating] = useState(false);

    const handleCreatePregunta = async (votacionId) => {
        try {
            let opciones = ["Sí", "No"];
            let preguntaTitulo = "";
            let valid = false;
            while (!valid) {
                const { value: formData } = await Swal.fire({
                    title: 'Crear Pregunta',
                    html: `
                      <input id="titulo" class="swal2-input" placeholder="Título de la pregunta" value="${preguntaTitulo}" />
                      <div id="opciones-container">
                        ${opciones.map((op, i) => `
                          <div style='display:flex;align-items:center;margin-bottom:4px;'>
                            <input class='swal2-input' style='width:70%;margin-right:6px;' id='opcion${i}' placeholder='Opción' value="${op}" />
                            <button type='button' class='swal2-cancel swal2-styled' style='padding:2px 8px;font-size:1.1em;' onclick='this.parentNode.remove()' ${opciones.length<=2?'disabled':''}>-</button>
                          </div>
                        `).join('')}
                        <button type='button' id='add-opcion-btn' class='swal2-confirm swal2-styled' style='margin-top:6px;padding:2px 12px;font-size:1em;'>+ Añadir opción</button>
                      </div>
                    `,
                    didOpen: () => {
                        document.getElementById('add-opcion-btn').onclick = () => {
                            const container = document.getElementById('opciones-container');
                            const count = container.querySelectorAll('input[id^="opcion"]').length;
                            if (count >= 6) return;
                            const div = document.createElement('div');
                            div.style.display = 'flex';
                            div.style.alignItems = 'center';
                            div.style.marginBottom = '4px';
                            div.innerHTML = `<input class='swal2-input' style='width:70%;margin-right:6px;' id='opcion${count}' placeholder='Opción' value='' />` +
                                `<button type='button' class='swal2-cancel swal2-styled' style='padding:2px 8px;font-size:1.1em;'>-</button>`;
                            div.querySelector('button').onclick = function() {
                                div.remove();
                            };
                            container.insertBefore(div, document.getElementById('add-opcion-btn'));
                        };
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Crear',
                    cancelButtonText: 'Cancelar',
                    preConfirm: () => {
                        preguntaTitulo = document.getElementById('titulo').value.trim();
                        const inputs = Array.from(document.querySelectorAll('input[id^="opcion"]'));
                        const values = inputs.map(i => i.value.trim()).filter(Boolean);
                        // Permitir signo de pregunta en título y opciones
                        if (!preguntaTitulo || preguntaTitulo.length < 3)
                          return Swal.showValidationMessage('El título es obligatorio (mínimo 3 caracteres)');
                        // Validar que el título puede contener cualquier carácter, incluido ?
                        if (values.length < 2)
                          return Swal.showValidationMessage('Debes ingresar al menos 2 opciones');
                        if (values.length > 6)
                          return Swal.showValidationMessage('Máximo 6 opciones');
                        // Permitir ? en las opciones
                        const set = new Set(values.map(v => v.toLowerCase()));
                        if (set.size !== values.length)
                          return Swal.showValidationMessage('No puede haber opciones repetidas');
                        opciones = values;
                        valid = true;
                        return {
                          preguntaTitulo,
                          opciones,
                          votacionId
                        };
                    }
                });
                if (!formData) return;
                setIsCreating(true);
                await createPregunta(formData);
                await Swal.fire('¡Éxito!', 'Pregunta creada correctamente', 'success');
                fetchPreguntas && fetchPreguntas();
            }
        } catch (error) {
            await Swal.fire('Error', 'No se pudo crear la pregunta', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    return { handleCreatePregunta, isCreating };
};

export default useCreatePregunta;
