import './ModalNotificacion.css';

function ModalNotificacion({ mostrar, tipo, titulo, mensaje, alAceptar, alCancelar }) {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-container border-${tipo}`}>
        <div className={`modal-header bg-${tipo}`}>
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
              className="btn-modal btn-success" 
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