"use strict";
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/initDb.js';
import { UserEntity } from '../entity/user.entity.js';
import { GeneracionEntity } from '../entity/generacion.entity.js';
import { VotacionEntity } from '../entity/votacion.entity.js';
import { registerValidation } from '../validations/auth.validation.js';

export async function registerUsuario(data) {
  const { error } = registerValidation.validate(data);
  if (error) {
    throw new Error(error.message);
  }

  const { username, rut, email, password, anioIngreso, role, creadorRole } = data;

  // Validar roles permitidos
  const rolesPermitidos = ["estudiante", "admin", "moderador", "superadministrador"];
  if (!rolesPermitidos.includes(role)) {
    throw new Error("Rol no válido. Los roles permitidos son: estudiante, admin, moderador, superadministrador.");
  }

  // Restringir creación de roles elevados
  if ((role === "admin" || role === "superadministrador") && creadorRole !== "superadministrador") {
    throw new Error("Solo un superadministrador puede crear usuarios con roles de administrador o superadministrador.");
  }

  const generacionRepo = AppDataSource.getRepository(GeneracionEntity);
  const generacion = await generacionRepo.findOneBy({ anio: anioIngreso });
  if (!generacion) {
    throw new Error("Año de ingreso no registrado");
  }

  const userRepo = AppDataSource.getRepository(UserEntity);
  const existe = await userRepo.findOneBy([{ email }, { rut }, { username }]);
  if (existe) {
    throw new Error("Ya existe un usuario con esos datos");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const nuevoUsuario = userRepo.create({
    username,
    rut,
    email,
    password: hashedPassword,
    role,
  });

  await userRepo.save(nuevoUsuario);
  return nuevoUsuario;
}