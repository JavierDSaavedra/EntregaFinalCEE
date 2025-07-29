import Swal from "sweetalert2";
import { FinanzasCreate } from "@services/finanzas.service.js";



async function RegistrosCreate() {
  const { value: formValues } = await Swal.fire({
    title: "Añadir Registro de Finanzas",
        html: `
       <div>
        <label for="swal2-input1">Nombre de Transacción</label>
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre de Transacción">
        </div>
        <div>
        <label for="swal2-input2">Descripción</label>
        <input id="swal2-input2" class="swal2-input" placeholder="Descripción">
    </div>
        <div>
        <label for="swal2-input3">Monto</label>
        <input id="swal2-input3" class="swal2-input" placeholder="Monto">
    </div>
        <div>
        <label for="swal2-input4">Tipo de Transacción</label> 
        <select id="swal2-input4" class="swal2-input">
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
    </div>
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Añadir",
    preConfirm: () => {
        const nombreTransaccion = document.getElementById("swal2-input1").value;
        const descripcion = document.getElementById("swal2-input2").value;
        const monto = document.getElementById("swal2-input3").value;
        const tipoTransaccion = document.getElementById("swal2-input4").value;

        if (!nombreTransaccion || !descripcion || !monto || !tipoTransaccion) {
          Swal.showValidationMessage("Por favor, completa todos los campos");
          return false;
        }
    },
  });
  if (formValues) {
    return {
        nombreTransaccion: formValues.nombreTransaccion,
        descripcion: formValues.descripcion,
        monto: formValues.monto,
        tipoTransaccion: formValues.tipoTransaccion,
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

  {user?.role === "tesorero" && (
  <button onClick={handleFinanzasCreate}>Añadir Registro</button>
)}