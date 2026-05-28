import '../../pages/ReportesGraficas/ReportesGraficas.css';

function TablaDisponibilidad({ libros }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título del Libro</th>
            <th>Autor</th>
            <th>Categoría</th>
            <th>ISBN</th>
            <th style={{ textAlign: 'center' }}>Ejemplares Totales</th>
          </tr>
        </thead>

        <tbody>
          {libros.length > 0 ? (
            libros.map((libro) => (
              <tr key={libro.id}>
                <td>{libro.id}</td>

                <td>
                  <strong>{libro.titulo}</strong>
                </td>

                <td>{libro.autor}</td>
                <td>{libro.categoria || '—'}</td>
                <td>{libro.isbn || '—'}</td>

                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {libro.ejemplares} pzas.
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="emptyRow">
                No hay registros disponibles para generar la tabla de auditoría.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaDisponibilidad;