export async function isCEE(req, res, next) {
    try {
      const { role } = req.user; // El rol del usuario autenticado
      if (role !== "President@" && role !== "Secretari@" && role !== "Tesorer@") {
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
      const { role } = req.user; // El rol del usuario autenticado
      if (role !== "Tesorer@") {
        return res.status(403).json({
          message: "Acceso denegado. Se requiere el rol de Tesorero.",
        });
      }
      next(); // Continuar si es Tesorero
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  }