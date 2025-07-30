import '@styles/Votaciones.css';
import useGetVotaciones from '@hooks/votaciones/useGetVotaciones';
import { useEffect, useState } from 'react';  
import useDeleteVotacion from '../hooks/votaciones/useDeleteVotacion';
import useEditVotacion from '../hooks/votaciones/useEditVotacion';
import useCreateVotacion from '../hooks/votaciones/useCreateVotacion';
import { useNavigate } from 'react-router-dom';

 //lo temporal
const useCreatePregunta = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVotacionId, setCurrentVotacionId] = useState(null);

    const handleCreatePregunta = (votacionId) => {
        setCurrentVotacionId(votacionId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentVotacionId(null);
    };

    const submitPregunta = async () => {
        setIsCreating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`Pregunta creada exitosamente para la votación ID: ${currentVotacionId}`);
            closeModal();
        } catch (error) {
            console.error('Error al crear pregunta:', error);
            alert('Error al crear la pregunta');
        } finally {
            setIsCreating(false);
        }
    };

    return {
        isCreating,
        isModalOpen,
        currentVotacionId,
        handleCreatePregunta,
        closeModal,
        submitPregunta
    };
};

const Votaciones = () => {
    const navigate = useNavigate();
    const { votaciones, fetchVotaciones } = useGetVotaciones();
    const { handleDeleteVotacion } = useDeleteVotacion(fetchVotaciones);
    const { handleEditVotacion } = useEditVotacion(fetchVotaciones);
    const { handleCreateVotacion, isCreating } = useCreateVotacion(fetchVotaciones);
    
    const {
        isCreating: isCreatingPregunta,
        isModalOpen,
        handleCreatePregunta,
        closeModal,
        submitPregunta
    } = useCreatePregunta();

    useEffect(() => {
        fetchVotaciones();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleAddVotacionModal = () => {
        handleCreateVotacion();
    };


    const handleCreatePreguntaModal = (votacionId) => {
        handleCreatePregunta(votacionId);
    };

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
        navigate(`/votaciones/${votacionId}/preguntas`);
    };

    return (
        <div className="votaciones-page">
            <div className="header-container">
                <h2>Lista de votaciones</h2>
                <button 
                    className="add-button"
                    onClick={handleAddVotacionModal}
                    disabled={isCreating}
                >
                    {isCreating ? 'Creando...' : '+ Añadir Votacion'}
                </button>
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
                                        <button 
                                            className="crear-pregunta-btn" 
                                            onClick={() => handleCreatePreguntaModal(votacion.votacionId)}
                                            title="Crear Pregunta"
                                            disabled={isCreatingPregunta}
                                        >
                                            {isCreatingPregunta ? '' : ''} Crear
                                        </button>
                                        <button 
                                            className="editar-pregunta-btn" 
                                            onClick={() => handleEditPreguntaModal(votacion.votacionId)}
                                            title="Editar Preguntas"
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="eliminar-pregunta-btn" 
                                            onClick={() => handleDeletePreguntaModal(votacion.votacionId)}
                                            title="Eliminar Preguntas"
                                        >
                                            Eliminar
                                        </button>
                                        <button 
                                            className="ver-preguntas-btn" 
                                            onClick={() => handleViewPreguntas(votacion.votacionId)}
                                            title="Ver todas las preguntas"
                                        >
                                            Ver
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div className="votacion-actions">
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

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Crear Nueva Pregunta</h2>
                            <button 
                                className="modal-close-btn" 
                                onClick={closeModal}
                                disabled={isCreatingPregunta}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-content">
                            <p>Modal para crear pregunta (funcionalidad temporal)</p>
                            <div className="modal-actions">
                                <button
                                    className="cancel-btn"
                                    onClick={closeModal}
                                    disabled={isCreatingPregunta}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="submit-btn"
                                    onClick={submitPregunta}
                                    disabled={isCreatingPregunta}
                                >
                                    {isCreatingPregunta ? 'creando' : 'Crear Pregunta'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Votaciones;