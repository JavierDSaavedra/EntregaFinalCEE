import React from 'react';
import { useNavigate } from 'react-router-dom';

const EncuestasButton = () => {
  const navigate = useNavigate();
  return (
    <button className="encuestas-btn" onClick={() => navigate('/votaciones')}>
      Ver Encuestas
    </button>
  );
};

export default EncuestasButton;
