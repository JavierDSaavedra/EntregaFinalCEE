import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "@styles/ceeLoginRegister.css";

import escudo from "@assets/escudo-color-gradiente.png";

const LoginRegisterForm = ({ mode = "login", onSubmit, loginError, registerError, registerSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onFormSubmit = async (data) => {
    try {
      const payload =
        mode === "login" ? { email: data.email, password: data.password } : data;

      await onSubmit(payload);
    } catch (error) {
      if (error.response) {
        console.error("Error del backend:", error.response.data);
      }
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="cee-login-container">
      <img src={escudo} alt="Escudo Universidad" className="cee-logo" />
      <h2 className="cee-title">
        {mode === "login" ? "Acceso CEE" : "Registro CEE"}
      </h2>
      <div className="cee-subtitle">Sistema de gestión estudiantil</div>
      {mode === "login" && loginError && (
        <div className="cee-error">{loginError}</div>
      )}
      {mode === "register" && registerError && (
        <div className="cee-error">{registerError}</div>
      )}
      {mode === "register" && registerSuccess && (
        <div className="cee-success">
          ¡Registro exitoso! Redirigiendo al login...
        </div>
      )}
      <form onSubmit={handleSubmit(onFormSubmit)} style={{ width: "100%" }}>
        {mode === "register" && (
          <div className="cee-form-group">
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              id="username"
              type="text"
              min={3}
              {...register("username", {
                required: "El nombre de usuario es obligatorio",
                minLength: {
                  value: 3,
                  message: "El nombre de usuario debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 30,
                  message: "El nombre de usuario debe tener como máximo 30 caracteres",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "El usuario sólo puede contener letras, números y guiones bajos",
                },
              })}
            />
            {errors.username && (
              <span className="cee-error">{errors.username.message}</span>
            )}
          </div>
        )}
        <div className="cee-form-group">
          <label htmlFor="email">Correo:</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
              minLength: {
                value: 15,
                message: "El correo debe tener al menos 15 caracteres",
              },
              maxLength: {
                value: 50,
                message: "El correo debe tener como máximo 50 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@alumnos\.ubiobio\.cl$/,
                message: "El correo debe ser institucional (@alumnos.ubiobio.cl)",
              },
            })}
          />
          {errors.email && (
            <span className="cee-error">{errors.email.message}</span>
          )}
        </div>

        {mode === "register" && (
          <>
            <div className="cee-form-group">
              <label htmlFor="rut">Rut:</label>
              <input
                id="rut"
                type="text"
                {...register("rut", {
                  required: "El rut es obligatorio",
                  pattern: {
                    value: /^\d{2}\.\d{3}\.\d{3}-[\dkK]$/,
                    message: "Formato rut inválido. Debe ser xx.xxx.xxx-x.",
                  },
                })}
              />
              {errors.rut && (
                <span className="cee-error">{errors.rut.message}</span>
              )}
            </div>
            <div className="cee-form-group">
              <label htmlFor="generacion">Generación (año de ingreso):</label>
              <input
                id="generacion"
                type="number"
                min={1900}
                max={currentYear}
                {...register("generacion", {
                  required: "La generación es obligatoria",
                  min: {
                    value: 1900,
                    message: "La generación debe ser al menos 1900",
                  },
                  max: {
                    value: currentYear,
                    message: `La generación no puede ser mayor que el año actual (${currentYear})`,
                  },
                  valueAsNumber: true,
                })}
              />
              {errors.generacion && (
                <span className="cee-error">{errors.generacion.message}</span>
              )}
            </div>
          </>
        )}

        <div className="cee-form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
              maxLength: {
                value: 26,
                message: "La contraseña debe tener como máximo 26 caracteres",
              },
            })}
          />
          {errors.password && (
            <span className="cee-error">{errors.password.message}</span>
          )}
        </div>

        <button className="cee-btn" type="submit">
          {mode === "login" ? "Entrar" : "Registrarse"}
        </button>
      </form>

      <div className="cee-footer">
        {mode === "login" ? (
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        )}
        <div style={{ marginTop: 8, fontSize: "0.95em", color: "#888" }}>
          CEE Facultad - Universidad del Bío-Bío © {currentYear}
        </div>
      </div>
    </div>
  );
}

export default LoginRegisterForm;
