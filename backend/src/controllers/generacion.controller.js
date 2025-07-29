"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { Like } from "typeorm";

export async function GetAlumnos(req, res) {
  console.log("🔍 === INICIANDO GetAlumnos ===");
  
  try {
    // Paso 1: Verificar que llegamos aquí
    console.log("✅ Controlador GetAlumnos ejecutándose");
    
    // Paso 2: Verificar AppDataSource
    console.log("🔗 Verificando conexión a base de datos...");
    console.log("AppDataSource existe:", !!AppDataSource);
    console.log("AppDataSource inicializado:", AppDataSource?.isInitialized);
    
    if (!AppDataSource?.isInitialized) {
      console.error("❌ Base de datos NO inicializada");
      return res.status(500).json({ 
        message: "Error de conexión a la base de datos",
        debug: "AppDataSource no inicializado"
      });
    }
    
    // Paso 3: Verificar repositorio
    console.log("📦 Obteniendo repositorio User...");
    const userRepository = AppDataSource.getRepository(User);
    console.log("Repository obtenido:", !!userRepository);
    
    // Paso 4: Hacer consulta simple primero
    console.log("🔍 Ejecutando consulta simple...");
    const totalUsers = await userRepository.count();
    console.log("Total de usuarios en la tabla:", totalUsers);
    
    // Paso 5: Consulta con filtro
    console.log("🎯 Ejecutando consulta con filtro...");
    const alumnos = await userRepository.find({ 
      where: { 
        email: Like('%@alumnos.ubiobio.cl') 
      } 
    });
    
    console.log("✅ Consulta exitosa. Alumnos encontrados:", alumnos.length);
    
    if (alumnos.length === 0) {
      console.log("⚠️ No se encontraron alumnos");
      return res.status(404).json({ 
        message: "No se encontraron alumnos con correo institucional.",
        totalUsers: totalUsers 
      });
    }

    console.log("🎉 Enviando respuesta exitosa");
    res.status(200).json({ 
      message: "Alumnos encontrados:", 
      data: alumnos,
      total: alumnos.length
    });
    
  } catch (error) {
    console.error("💥 === ERROR CAPTURADO ===");
    console.error("Tipo de error:", error.constructor.name);
    console.error("Mensaje:", error.message);
    console.error("Stack completo:", error.stack);
    
    // Errores específicos de TypeORM
    if (error.name === 'QueryFailedError') {
      console.error("🔍 Error de consulta SQL:");
      console.error("Query:", error.query);
      console.error("Parámetros:", error.parameters);
    }
    
    // Error de conexión
    if (error.code) {
      console.error("Código de error:", error.code);
    }
    
    res.status(500).json({ 
      message: "Error interno del servidor",
      error: error.message,
      type: error.constructor.name
    });
  }
}

export async function GetAlumnosByGeneracion(req, res) {
  console.log("🔍 === INICIANDO GetAlumnosByGeneracion ===");
  
  try {
    console.log("✅ Parámetros recibidos:", req.params);
    
    const userRepository = AppDataSource.getRepository(User);
    const { generacion } = req.params;
    
    console.log("🎯 Buscando generación:", generacion);
    
    const users = await userRepository.find({ 
      where: { generacion }
    });

    console.log("✅ Usuarios encontrados:", users.length);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No se encontraron alumnos para esa generación." });
    }

    res.status(200).json({ message: "Alumnos encontrados:", data: users });
  } catch (error) {
    console.error("💥 === ERROR en GetAlumnosByGeneracion ===");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ 
      message: "Error interno del servidor.",
      error: error.message
    });
  }
}