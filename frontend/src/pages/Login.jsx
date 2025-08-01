import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { loginService } from "@services/auth.service.js";
import "@styles/ceeLoginRegister.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  // Función que maneja el envío del formulario de inicio de sesión
  const loginSubmit = async (data) => {
    try {
      const response = await loginService(data);
      if (response.request.status === 200) {
        navigate("/home");
      } else {
        setLoginError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="cee-bg">
      <LoginRegisterForm mode="login" onSubmit={loginSubmit} loginError={loginError} />
    </div>
  );
};

export default Login;
