export async function isCEE(req, res, next) {
    try {
      console.log("🛡️ Entrando a isCEE");
      if (!req.user) {
        console.error("❌ req.user no está definido");
        return res.status(401).json({ message: "No autenticado" });
      }
      const { role } = req.user;
      console.log("Rol detectado:", role);
      if (role !== "presidente" && role !== "secretario" && role !== "tesorero") {
        return res.status(403).json({
          message: "Acceso denegado. Se requiere el rol de CEE.",
        });
      }
      next();
    } catch (error) {
      console.error("💥 Error en isCEE:", error);
      res.status(500).json({ message: "Error interno del servidor (middleware)", error: error.message });
    }
  }
  
  export async function isTesorero(req, res, next) {
    try {
      const { role } = req.user; // Cambié 'role' por 'rol'
      if (role !== "tesorero") {
        return res.status(403).json({
          message: "Acceso denegado. Se requiere el rol de Tesorero.",
        });
      }
      next(); // Continuar si es Tesorero
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  }