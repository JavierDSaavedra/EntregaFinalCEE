import Swal from "sweetalert2";
import { FinanzasDelete } from "@services/finanzas.service.js";

async function confirmDeleteFinanza() {
  const result = await Swal.fire({
    title: "Eliminar registro",
    text: "¿Seguro que quieres eliminar este registro?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    focusCancel: true,
  });
  return result.isConfirmed;
}

async function confirmAlert() {
  await Swal.fire({
    title: "Eliminado",
    text: "Registro eliminado correctamente.",
    icon: "success",
    confirmButtonText: "Ok",
  });
}

async function confirmError() {
  await Swal.fire({
    title: "Error",
    text: "No se pudo eliminar el registro.",
    icon: "error",
    confirmButtonText: "Ok",
  });
}

export const useDeleteFinanza = (fetchFinanzas) => {
  const handleDeleteFinanza = async (finanzas) => {
    try {
      // SweetAlert para elegir registro por ID o Nombre_Transaccion
      const { value: tipo } = await Swal.fire({
        title: '¿Buscar registro por ID o Nombre de Transacción?',
        input: 'radio',
        inputOptions: {
          id: 'ID',
          nombre: 'Nombre de Transacción'
        },
        inputValidator: (value) => !value && 'Debes seleccionar una opción',
        confirmButtonText: 'Continuar',
        showCancelButton: true
      });
      if (!tipo) return;
      let identificador = {};
      if (tipo === 'id') {
        const { value: id } = await Swal.fire({
          title: 'Ingresa el ID',
          input: 'number',
          inputLabel: 'ID',
          inputValidator: (value) => !value && 'Debes ingresar un ID',
          showCancelButton: true
        });
        if (!id) return;
        identificador = { id: Number(id) };
      } else {
        const { value: nombre } = await Swal.fire({
          title: 'Ingresa el Nombre de Transacción',
          input: 'text',
          inputLabel: 'Nombre de Transacción',
          inputValidator: (value) => !value && 'Debes ingresar un nombre',
          showCancelButton: true
        });
        if (!nombre) return;
        identificador = { Nombre_Transaccion: nombre };
      }
      const isConfirmed = await confirmDeleteFinanza();
      if (isConfirmed) {
        const response = await FinanzasDelete(identificador);
        if (response) {
          await confirmAlert();
          await fetchFinanzas();
        }
      }
    } catch (error) {
      console.error("Error al eliminar registro de finanzas:", error);
      confirmError();
    }
  };
  return { handleDeleteFinanza };
};

export default useDeleteFinanza;
