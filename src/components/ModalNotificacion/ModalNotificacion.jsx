import './ModalNotificacion.css';

function ModalNotificacion({ mostrar, tipo, titulo, mensaje, alAceptar, alCancelar }) {
  if (!mostrar) return null;

  const temaColor = (tipo === 'danger' || tipo === 'error') ? 'danger-confirm' : tipo;
  const claseBotonAceptar = (tipo === 'danger' || tipo === 'error') ? 'btn-danger' : 'btn-success';

  return (
    <div className="modal-overlay">
      {/* 🌟 CORREGIDO: Se agregaron los backticks para la interpolación de clases */}
      <div className={`modal-container border-${temaColor}`}>
        
        {/* 🌟 CORREGIDO: Se agregaron los backticks aquí también */}
        <div className={`modal-header bg-${temaColor}`}>
          <h3>{titulo}</h3>
        </div>
        
        <div className="modal-body">
          <p>{mensaje}</p>
        </div>
        
        <div className="modal-footer">
          {tipo === 'danger-confirm' ? (
            <>
              <button 
                type="button" 
                className="btn-modal btn-danger" 
                onClick={alAceptar}
              >
                Eliminar
              </button>
              <button 
                type="button" 
                className="btn-modal btn-secondary" 
                onClick={alCancelar}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button 
              type="button" 
              className={`btn-modal ${claseBotonAceptar}`} 
              onClick={alAceptar}
            >
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalNotificacion;