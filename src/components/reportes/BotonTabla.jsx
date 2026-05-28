import '../../pages/ReportesGraficas/ReportesGraficas.css';

function BotonTabla({ children, onClick, active }) {
  return (
    <button
    type="button"
    className={`btn primary ${active ? 'active' : ''}`}
    style={{ margin: '20px' }}
    onClick={onClick}
    >
      {children}
    </button>
  );
}

export default BotonTabla;