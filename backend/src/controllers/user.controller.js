import UserEntity from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";


export async function getUsersByGeneracion(req, res) {
  try {
    const repository = AppDataSource.getRepository(UserEntity);
    const { generacion } = req.params;

    if (!generacion) {
      return res.status(400).json({ success: false, message: "Debes especificar una generación." });
    }

    const users = await repository.find({ where: { Generacion: Number(generacion) } });
    res.status(200).json({ success: true, message: `Usuarios de la generación ${generacion}`, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
}


export async function getUsers(req, res) {
  try {
    const repository = AppDataSource.getRepository(UserEntity);
    const users = await repository.find();
    res.status(200).json({ success: true, message: "Usuarios encontrados", data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
}


export async function getUserById(req, res) {
  try {
    const repository = AppDataSource.getRepository(UserEntity);
    const { id } = req.params;
    const user = await repository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    res.status(200).json({ success: true, message: "Usuario encontrado", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
}


export async function updateUserById(req, res) {
  try {
    const repository = AppDataSource.getRepository(UserEntity);
    const { id } = req.params;
    const { username, email, rut, Generacion, generacion } = req.body;
    const user = await repository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.rut = rut || user.rut;
    if (Generacion !== undefined && Generacion !== null) {
      user.Generacion = Generacion;
    } else if (generacion !== undefined && generacion !== null) {
      user.Generacion = generacion;
    }

    await repository.save(user);
    res.status(200).json({ success: true, message: "Usuario actualizado exitosamente.", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
}


export async function deleteUserById(req, res) {
  try {
    const repository = AppDataSource.getRepository(UserEntity);
    const { id } = req.params;
    const user = await repository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado." });
    }

    await repository.remove(user);
    res.status(200).json({ success: true, message: "Usuario eliminado exitosamente." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
}


export async function getProfile(req, res) {
  try {
    const repository = AppDataSource.getRepository(UserEntity);
    const userEmail = req.user.email;
    const user = await repository.findOne({ where: { email: userEmail } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Perfil no encontrado." });
    }

    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      rut: user.rut,
      role: user.role,
      Generacion: user.Generacion
    };

    res.status(200).json({ success: true, message: "Perfil encontrado", data: formattedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}
