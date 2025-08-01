export async function isAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const { role } = req.user;
    if (role !== "administrador") {
      return res.status(403).json({
        message: "Error al acceder al recurso. Se requiere un rol de administrador para realizar esta acción.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

export async function isCEE(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const { role } = req.user;
    if (["presidente", "secretario", "tesorero"].includes(role)) {
      return next();
    }
    return res.status(403).json({
      message: "Acceso solo permitido para miembros del CEE (presidente, secretario, tesorero)."
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}

export async function isTesorero(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const { role } = req.user;
    if (role !== "tesorero") {
      return res.status(403).json({
        message: "Acceso denegado. Se requiere el rol de Tesorero.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error });
  }
}
