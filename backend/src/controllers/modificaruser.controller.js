"use strict";

import { AppDataSource } from "../config/initDb.js";
import { UserEntity } from "../entity/user.entity.js";

// Cambiar el rol de un usuario (solo admin)
export async function cambiarRolUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nuevoRol } = req.body;

    // Verifica si quien hace la petición es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado. Solo administradores pueden cambiar roles." });
    }

    const userRepo = AppDataSource.getRepository(UserEntity);
    const usuario = await userRepo.findOneBy({ id });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const rolesPermitidos = ["estudiante", "admin", "moderador"];
    if (!rolesPermitidos.includes(nuevoRol)) {
      return res.status(400).json({ message: "Rol no válido." });
    }

    usuario.role = nuevoRol;
    await userRepo.save(usuario);

    res.status(200).json({
      message: "Rol actualizado correctamente.",
      data: { id: usuario.id, nuevoRol }
    });
  } catch (error) {
    console.error("Error en cambiarRolUsuario:", error);
    res.status(500).json({ message: "Error al cambiar el rol del usuario." });
  }
}
