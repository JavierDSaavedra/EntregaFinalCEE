"use strict";
import UserEntity from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { Like } from "typeorm";

export async function GetAlumnos(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const alumnos = await userRepository.find({ 
      where: { 
        email: Like('%@alumnos.ubiobio.cl') 
      } 
    });

    if (alumnos.length === 0) {
      return res.status(404).json({ 
        message: "No se encontraron alumnos con correo institucional."
      });
    }

    // Elimina la contraseña de cada usuario
    const alumnosSinPassword = alumnos.map(({ password, ...rest }) => rest);

    res.status(200).json({ 
      message: "Alumnos encontrados:", 
      data: alumnosSinPassword,
      total: alumnosSinPassword.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error interno del servidor",
      error: error.message
    });
  }
}

export async function GetAlumnosByGeneracion(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(UserEntity);
    const { generacion } = req.params;
    const users = await userRepository.find({ 
      where: { Generacion: generacion }
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No se encontraron alumnos para esa generación." });
    }

    // Elimina la contraseña de cada usuario
    const usersSinPassword = users.map(({ password, ...rest }) => rest);

    res.status(200).json({ message: "Alumnos encontrados:", data: usersSinPassword });
  } catch (error) {
    res.status(500).json({ 
      message: "Error interno del servidor.",
      error: error.message
    });
  }
}