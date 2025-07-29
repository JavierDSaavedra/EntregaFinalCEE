"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";



export async function GetAlumnosByGeneracion(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { generacion } = req.params;
    const users = await userRepository.find({ where: { generacion } });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No se encontraron alumnos para esa generación." });
    }

    res.status(200).json({ message: "Alumnos encontrados:", data: users });
  } catch (error) {
    console.error("Error en generacion.controller.js -> GetAlumnosByGeneracion(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function GetAlumnos(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    // Buscar usuarios cuyo email termine en @alumnos.ubiobio.cl
    const alumnos = await userRepository.find();
    const alumnosFiltrados = alumnos.filter(user =>
      user.email && user.email.endsWith("@alumnos.ubiobio.cl")
    );

    if (alumnosFiltrados.length === 0) {
      return res.status(404).json({ message: "No se encontraron alumnos con correo institucional." });
    }

    res.status(200).json({ message: "Alumnos encontrados:", data: alumnosFiltrados });
  } catch (error) {
    console.error("Error en generacion.controller.js -> GetAlumnos(): ", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}