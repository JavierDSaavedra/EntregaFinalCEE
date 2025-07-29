export async function isCEE(req, res, next) {
    try {
      const { rol } = req.user; // Cambié 'role' por 'rol'
      if (rol !== "presidente" && rol !== "secretario" && rol !== "tesorero") {
        return res.status(403).json({
          message: "Acceso denegado. Se requiere el rol de CEE.",
        });
      }
      next(); // Continuar si es CEE
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  }
  
  export async function isTesorero(req, res, next) {
    try {
      const { rol } = req.user; // Cambié 'role' por 'rol'
      if (rol !== "tesorero") {
        return res.status(403).json({
          message: "Acceso denegado. Se requiere el rol de Tesorero.",
        });
      }
      next(); // Continuar si es Tesorero
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  }