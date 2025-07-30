export async function isCEE(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    const { role } = req.user;
    if (role !== "presidente" && role !== "secretario" && role !== "tesorero") {
      return res.status(403).json({
        message: "Acceso denegado. Se requiere el rol de CEE.",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor (middleware)", error: error.message });
  }
}

export async function isTesorero(req, res, next) {
  try {
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