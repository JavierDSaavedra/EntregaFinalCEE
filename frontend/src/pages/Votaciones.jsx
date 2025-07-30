import '@styles/Votaciones.css';
import useGetVotaciones from '@hooks/votaciones/useGetVotaciones';
import { useEffect, useState } from 'react';  
import useDeleteVotacion from '../hooks/votaciones/useDeleteVotacion';
import useEditVotacion from '../hooks/votaciones/useEditVotacion';
import useCreateVotacion from '../hooks/votaciones/useCreateVotacion';
import { useNavigate } from 'react-router-dom';

import useCreatePregunta from '@hooks/preguntas/useCreatePregunta';
import { useAuth } from '@context/AuthContext';

const Votaciones = () => {
    const navigate = useNavigate();
    const { votaciones, fetchVotaciones } = useGetVotaciones();
    const { handleDeleteVotacion } = useDeleteVotacion(fetchVotaciones);
    const { handleEditVotacion } = useEditVotacion(fetchVotaciones);
    const { handleCreateVotacion, isCreating } = useCreateVotacion(fetchVotaciones);
    const { isCreating: isCreatingPregunta, handleCreatePregunta } = useCreatePregunta();
    const { user } = useAuth();

    useEffect(() => {
        fetchVotaciones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleAddVotacionModal = () => {
        handleCreateVotacion();
    };



    // Ya no se necesita handleCreatePreguntaModal, se llama directo en el botón

    const handleEditPreguntaModal = (votacionId) => {

        console.log('Editar pregunta para votacion:', votacionId);
        alert('estamo trabajando');
    };

    const handleDeletePreguntaModal = (votacionId) => {

        console.log('Eliminar pregunta para votacion:', votacionId);
        const confirmar = window.confirm('eliminar?');
        if (confirmar) {
            alert('estamo trabajando');
        }
    };

    const handleViewPreguntas = (votacionId) => {
        navigate(`/preguntas-votacion/${votacionId}`);
    };

    return (
        <div className="votaciones-page">
            <div className="header-container">
                <h2>Lista de votaciones</h2>
                {user && ["presidente", "secretario", "tesorero"].includes(user.rol || user.role) && (
                  <button 
                      className="add-button"
                      onClick={handleAddVotacionModal}
                      disabled={isCreating}
                  >
                      {isCreating ? 'Creando...' : '+ Añadir Votacion'}
                  </button>
                )}
            </div>
            
            <table className="votaciones-table">
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descripción</th> 
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Cierre</th>
                        <th>Estado</th>
                        <th>Preguntas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {votaciones === null || votaciones === undefined ? (
                        <tr>
                            <td colSpan="7">Cargando votaciones...</td>
                        </tr>
                    ) : Array.isArray(votaciones) && votaciones.length > 0 ? (
                        votaciones.map((votacion, index) => (
                            <tr key={`votacion-${votacion.votacionId || index}`}>
                                <td>{votacion.votacionTitulo}</td>
                                <td>{votacion.votacionDescripcion}</td>
                                <td>{new Date(votacion.votacionFechaInicio).toLocaleDateString()}</td>
                                <td>{new Date(votacion.votacionFechaFin).toLocaleDateString()}</td>
                                <td>
                                    <span className={`estado-badge estado-${votacion.votacionEstado}`}>
                                        {votacion.votacionEstado}
                                    </span>
                                </td>
                                <td>
                                    <div className="preguntas-actions">
                                        {user && ["presidente", "secretario", "tesorero"].includes(user.rol || user.role) ? (
                                            <button 
                                                className="ver-preguntas-btn" 
                                                onClick={() => handleViewPreguntas(votacion.votacionId)}
                                                title="Gestionar Preguntas"
                                            >
                                                Gestionar
                                            </button>
                                        ) : (
                                            <button 
                                                className="ver-preguntas-btn" 
                                                onClick={() => navigate(`/preguntas-responder/${votacion.votacionId}`)}
                                                title="Responder Preguntas"
                                            >
                                                Responder
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="votacion-actions">
                                        {user && ["presidente", "secretario", "tesorero"].includes(user.rol || user.role) && (
                                            <>
                                                <button 
                                                    className="edit" 
                                                    onClick={() => handleEditVotacion(votacion.votacionId, votacion)}
                                                >
                                                    Editar
                                                </button>
                                                <button 
                                                    className="delete" 
                                                    onClick={() => handleDeleteVotacion(votacion.votacionId)}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No hay votaciones disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>


        </div>
    );
};

export default Votaciones;