
import Swal from "sweetalert2";
import { FinanzasCreate } from "@services/finanzas.service.js";



async function RegistrosCreate() {
  const { value: formValues } = await Swal.fire({
    title: "Nuevo registro",
    html: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre de transacción (obligatorio)">
        <input id="swal2-input2" class="swal2-input" placeholder="Descripción (opcional)">
        <input id="swal2-input3" class="swal2-input" placeholder="Monto (obligatorio)" type="number" min="0">
        <select id="swal2-input4" class="swal2-input">
          <option value="">Tipo de transacción</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const nombreTransaccion = document.getElementById("swal2-input1").value;
      const descripcion = document.getElementById("swal2-input2").value;
      const monto = document.getElementById("swal2-input3").value;
      const tipoTransaccion = document.getElementById("swal2-input4").value;
      if (!nombreTransaccion || !monto || !tipoTransaccion) {
        Swal.showValidationMessage("Completa los campos obligatorios");
        return false;
      }
    },
  });
  if (formValues) {
    const descripcion = document.getElementById("swal2-input2").value;
    return {
        Nombre_Transaccion: document.getElementById("swal2-input1").value,
        Descripcion: descripcion === '' ? undefined : descripcion,
        Monto: Number(document.getElementById("swal2-input3").value),
        Tipo_Transaccion: document.getElementById("swal2-input4").value,
    };
  }
}

export const useFinanzasCreate = (fetchFinanzas) => {
  const handleFinanzasCreate = async () => {
    try {
      const formValues = await RegistrosCreate();
      if (!formValues) return;

      const response = await FinanzasCreate(formValues);

      if(response) {
        await fetchFinanzas();
      }
    } catch (error) {
      console.log("Error al crear registro de finanzas:", error);
    }
  };
  return {
    handleFinanzasCreate,
  };
}       

  export default useFinanzasCreate;