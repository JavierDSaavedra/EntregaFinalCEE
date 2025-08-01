import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { registerService } from '@services/auth.service.js';
import '@styles/ceeLoginRegister.css';

const Register = () => {
    const navigate = useNavigate();

    const [registerError, setRegisterError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState(false);

    const registerSubmit = async (data) => {
        setRegisterError("");
        setRegisterSuccess(false);
        try {
            // Mapear generacion (minúscula) a Generacion (mayúscula inicial) para el backend
            const dataToSend = { ...data };
            if (dataToSend.generacion !== undefined) {
                dataToSend.Generacion = dataToSend.generacion;
                delete dataToSend.generacion;
            }
            const response = await registerService(dataToSend);
            if (response && response.status === 201) {
                setRegisterSuccess(true);
                setTimeout(() => navigate("/login"), 1800);
            } else if (response && response.data && response.data.errors) {
                const firstError = Object.values(response.data.errors)[0];
                setRegisterError(firstError);
            } else if (response && response.data && response.data.message) {
                setRegisterError(response.data.message);
            } else {
                setRegisterError("Error desconocido al registrar usuario");
            }
        } catch (error) {
            setRegisterError("Error al registrar usuario");
        }
    }
    return (
      <div className="cee-bg">
        <LoginRegisterForm mode="register" onSubmit={registerSubmit} registerError={registerError} registerSuccess={registerSuccess} />
      </div>
    )
}

export default Register;