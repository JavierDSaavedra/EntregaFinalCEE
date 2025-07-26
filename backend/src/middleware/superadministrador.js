export async function isSuperAdmin(req, res, next) {
    try {
      const { role } = req.user; // El rol del usuario autenticado
      if (role !== "superadministrador") {
        return res.status(403).json({
          message: "Acceso denegado. Se requiere el rol de superadministrador.",
        });
      }
      next(); // Continuar si es superadministrador
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  }