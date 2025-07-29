"use strict";

import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

// Función para crear usuarios por defecto
// Se aplica sólo al iniciar la base de datos
export async function createUsers() {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const count = await userRepository.count();
        if (count > 0) return;
        const users = [
            {
                username: "Administrador",
                rut: "12345678-9",
                email: "admin@alumnos.ubiobio.cl",
                password: await encryptPassword("admin123"),
                role: "administrador"
            },
            {
                username: "Usuario",
                rut: "98765432-1",
                email: "usuario@alumnos.ubiobio.cl.com",
                password: await encryptPassword("usuario123"),
                role: "user"
            },
            {
                username: "Tesorer@",
                rut: "44333222-1",
                email: "tesorero@alumnos.ubiobio.cl",
                password: await encryptPassword("plata123"),
                role: "tesorero"
            },
            {
                username: "President@",
                rut: "11112222-1",
                email: "presidente@alumnos.ubiobio.cl",
                password: await encryptPassword("presidente123"),
                role: "presidente"
            },
            {
                username: "Secretari@",
                rut: "22333444-5",
                email: "secretario@alumnos.ubiobio.cl",
                password: await encryptPassword("secretario123"),
                role: "secretario"
            }
        ]

        console.log("Creando usuarios...");

        for (const user of users) {
            await userRepository.save((
                userRepository.create(user)
            ));
            console.log(`Usuario '${user.username}' creado exitosamente.`);
        }
    } catch (error) {
        console.error("Error al crear usuarios: ", error);
        process.exit(1);
    }
}