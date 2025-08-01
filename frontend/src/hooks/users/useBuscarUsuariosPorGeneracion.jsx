import { useState } from "react";

const useBuscarUsuariosPorGeneracion = () => {
  const [generacionInput, setGeneracionInput] = useState("");
  const [usuariosGen, setUsuariosGen] = useState([]);
  const [loadingGen, setLoadingGen] = useState(false);
  const [errorGen, setErrorGen] = useState("");

  const handleBuscarGeneracion = async (e) => {
    if (e) e.preventDefault();
    setLoadingGen(true);
    setErrorGen("");
    setUsuariosGen([]);
    try {
      const { getUsersByGeneracion } = await import("@services/user.service.js");
      const data = await getUsersByGeneracion(generacionInput);
      setUsuariosGen(data);
      if (!data || data.length === 0) setErrorGen("No se encontraron usuarios para esa generación.");
    } catch (err) {
      setErrorGen("Error al buscar usuarios por generación");
    } finally {
      setLoadingGen(false);
    }
  };

  return {
    generacionInput,
    setGeneracionInput,
    usuariosGen,
    loadingGen,
    errorGen,
    handleBuscarGeneracion,
  };
};

export default useBuscarUsuariosPorGeneracion;
