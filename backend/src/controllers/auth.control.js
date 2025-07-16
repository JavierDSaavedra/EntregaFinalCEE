"use strict";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";


export async function getUsers(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    res.status(200).json({
      message: "Usuarios encontrados",
      data: users
    });
  } catch (error) {
    console.error(" Error en getUsers:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}


export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.status(200).json({
      message: "Usuario encontrado",
      data: user
    });
  } catch (error) {
    console.error("Error en getUserById:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}


export async function updateUserById(req, res) {
  try {
    const { id } = req.params;
    const { username, email, rut } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.rut = rut || user.rut;

    await userRepository.save(user);

    res.status(200).json({
      message: "Usuario actualizado exitosamente.",
      data: user
    });
  } catch (error) {
    console.error(" Error en updateUserById:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}


export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    await userRepository.remove(user);

    res.status(200).json({ message: "Usuario eliminado exitosamente." });
  } catch (error) {
    console.error(" Error en deleteUserById:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}

export async function getProfile(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const userEmail = req.user.email; 

    const user = await userRepository.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "Perfil no encontrado." });
    }

    const { id, username, email, rut, role } = user;

    res.status(200).json({
      message: "Perfil obtenido correctamente",
      data: { id, username, email, rut, role }
    });
  } catch (error) {
    console.error(" Error en getProfile:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
}