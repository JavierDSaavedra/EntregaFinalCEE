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

  const { username, rut, email, password, anioIngreso, role } = data;

  const generacionRepo = AppDataSource.getRepository(GeneracionEntity);
  const generacion = await generacionRepo.findOneBy({ anio: anioIngreso });
  if (!generacion) {
    throw new Error('Año de ingreso no registrado');
  }

  const votacionRepo = AppDataSource.getRepository(VotacionEntity);
  const resultado = await votacionRepo
    .createQueryBuilder('voto')
    .select('SUM(CASE WHEN voto.positivo THEN 1 ELSE 0 END)::float / COUNT(*) * 100', 'porcentaje')
    .where('voto.rol = :role', { role })
    .getRawOne();

  const porcentaje = parseFloat(resultado.porcentaje) || 0;
  if (porcentaje < 60) {
    throw new Error('El rol no cuenta con el 60% de aprobación mínima');
  }

  const userRepo = AppDataSource.getRepository(UserEntity);
  const existe = await userRepo.findOneBy([{ email }, { rut }, { username }]);
  if (existe) {
    throw new Error('Ya existe un usuario con esos datos');
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
