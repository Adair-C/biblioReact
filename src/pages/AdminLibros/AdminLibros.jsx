import { useState, useEffect } from 'react';
import ModalNotificacion from '../../components/ModalNotificacion/ModalNotificacion';
import './AdminLibros.css';

function AdminLibros({ usuarioLogueado, alCerrarSesion }) {
  const [libros, setLibros] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [idLibroAEliminar, setIdLibroAEliminar] = useState(null); // 🔥 Guarda temporalmente el ID a borrar
  
  // Estado básico para el contenido del modal
  const [modal, setModal] = useState({
    mostrar: false,
    tipo: 'success',
    titulo: '',
    mensaje: ''
  });

  const estadoFormularioInicial = {
    id: 0,
    titulo: '',
    autor: '',
    anioPublicacion: '',
    editorial: '',
    categoria: '',
    isbn: '',
    idioma: '',
    paginas: '',
    ejemplares: 0,
    portadaUrl: '',
    resumen: ''
  };

  const [form, setForm] = useState(estadoFormularioInicial);
  const [editando, setEditando] = useState(false);

  const categorias = [
    "Acción", "Aventura", "Ciencia Ficción", "Distopía", 
    "Fantasía", "Terror", "Romance", "Suspenso", 
    "Policial", "Biografía", "Historia"
  ];

  // Obtener libros desde la API C# (Cambiado a Puerto 5224)
  const obtenerLibros = async () => {
    try {
      const url = busqueda.trim() 
        ? `http://localhost:5224/api/Libros/buscar?q=${encodeURIComponent(busqueda.trim())}`
        : 'http://localhost:5224/api/Libros';
        
      const response = await fetch(url);
      if (response.ok) {
        const datos = await response.json();
        setLibros(datos);
      }
    } catch (error) {
      console.error("Error al obtener libros:", error);
    }
  };

  useEffect(() => {
    obtenerLibros();
  }, [busqueda]);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'ejemplares' || name === 'paginas' || name === 'anioPublicacion' 
        ? (value ? parseInt(value) : '') 
        : value
    });
  };

  // Guardar o Editar un libro (Cambiado a Puerto 5224)
  const manejarGuardar = async (e) => {
    e.preventDefault();
    const url = editando ? `http://localhost:5224/api/Libros/${form.id}` : 'http://localhost:5224/api/Libros';
    const metodo = editando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const textoModal = editando ? 'El libro se ha editado correctamente.' : 'El libro se ha agregado correctamente.';
        
        cancelarEdicion();
        await obtenerLibros();

        // Lanzar modal de éxito (Verde)
        setModal({
          mostrar: true,
          tipo: 'success',
          titulo: '¡Operación Exitosa!',
          mensaje: textoModal
        });
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // Primer paso de borrado: Muestra confirmación (Modal Rojo)
  const manejarEliminar = (id) => {
    setIdLibroAEliminar(id); // Almacena el ID de manera síncrona y segura
    setModal({
      mostrar: true,
      tipo: 'danger-confirm',
      titulo: '¿Estás seguro?',
      mensaje: '¿Realmente deseas eliminar este libro? Esta acción no se puede deshacer.'
    });
  };

  // Segundo paso de borrado: Petición DELETE (Cambiado a Puerto 5224)
  const confirmarEliminacion = async () => {
    if (!idLibroAEliminar) return;

    try {
      const response = await fetch(`http://localhost:5224/api/Libros/${idLibroAEliminar}`, { 
        method: 'DELETE' 
      });

      if (response.ok) {
        await obtenerLibros(); // Refresca la tabla reactivamente
        if (form.id === idLibroAEliminar) cancelarEdicion();
        
        setIdLibroAEliminar(null);

        // Transiciona de inmediato al modal de éxito (Verde)
        setModal({
          mostrar: true,
          tipo: 'success',
          titulo: 'Libro Eliminado',
          mensaje: 'El libro se ha borrado correctamente del sistema.'
        });
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Función común para cerrar modales e invalidar selecciones temporales
  const cerrarModal = () => {
    setModal(prev => ({ ...prev, mostrar: false }));
    setIdLibroAEliminar(null);
  };

  const cargarParaEditar = (libro) => {
    setForm({
      id: libro.id,
      titulo: libro.titulo,
      autor: libro.autor,
      anioPublicacion: libro.anioPublicacion || '',
      editorial: libro.editorial || '',
      categoria: libro.categoria || '',
      isbn: libro.isbn || '',
      idioma: libro.idioma || '',
      paginas: libro.paginas || '',
      ejemplares: libro.ejemplares,
      portadaUrl: libro.portadaUrl || '',
      resumen: libro.resumen || ''
    });
    setEditando(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setForm(estadoFormularioInicial);
    setEditando(false);
  };

  return (
    <>
      <main className="page">
        <header className="pageHead">
          <div>
            <p className="kicker">Panel bibliográfico</p>
            <h1>Administración de libros</h1>
            <p className="pageText">
              Gestiona el catálogo principal de Biblio+. Desde aquí puedes registrar,
              actualizar y eliminar libros del sistema.
            </p>
          </div>

          <div className="headBadge">
            <span className="roleTag">{usuarioLogueado?.rol}</span>
            <span className="userTag">{usuarioLogueado?.nombre}</span>
          </div>
        </header>

        {/* FORMULARIO CRUD */}
        <section className="admin-card">
          <div className="cardTitle">
            <h2>{editando ? 'Editar libro' : 'Registrar nuevo libro'}</h2>
          </div>

          <form className="formCrud" onSubmit={manejarGuardar}>
            <div className="grid">
              <label className="field wide">
                <span>Título</span>
                <input type="text" name="titulo" required value={form.titulo} onChange={manejarCambioInput} />
              </label>
              <label className="field wide">
                <span>Autor</span>
                <input type="text" name="autor" required value={form.autor} onChange={manejarCambioInput} />
              </label>
              <label className="field">
                <span>Año de publicación</span>
                <input type="number" name="anioPublicacion" value={form.anioPublicacion} onChange={manejarCambioInput} />
              </label>
              <label className="field">
                <span>Editorial</span>
                <input type="text" name="editorial" value={form.editorial} onChange={manejarCambioInput} />
              </label>
              <label className="field">
                <span>Categoría</span>
                <select name="categoria" required value={form.categoria} onChange={manejarCambioInput}>
                  <option value="" disabled>Selecciona una categoría</option>
                  {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </label>
              <label className="field">
                <span>ISBN</span>
                <input type="text" name="isbn" value={form.isbn} onChange={manejarCambioInput} />
              </label>
              <label className="field">
                <span>Idioma</span>
                <input type="text" name="idioma" value={form.idioma} onChange={manejarCambioInput} />
              </label>
              <label className="field">
                <span>Páginas</span>
                <input type="number" name="paginas" value={form.paginas} onChange={manejarCambioInput} />
              </label>
              <label className="field">
                <span>Ejemplares</span>
                <input type="number" name="ejemplares" required value={form.ejemplares} onChange={manejarCambioInput} />
              </label>
              <label className="field wide">
                <span>URL de portada</span>
                <input type="text" name="portadaUrl" value={form.portadaUrl} onChange={manejarCambioInput} />
              </label>
              <label className="field wide">
                <span>Resumen</span>
                <textarea name="resumen" rows="4" value={form.resumen} onChange={manejarCambioInput} />
              </label>
            </div>

            <div className="formActions">
              <button className="btn primary" type="submit">{editando ? 'Guardar cambios' : 'Registrar libro'}</button>
              <button className="btn ghost" type="button" onClick={editando ? cancelarEdicion : () => setForm(estadoFormularioInicial)}>
                {editando ? 'Cancelar' : 'Limpiar'}
              </button>
            </div>
          </form>
        </section>

        {/* LISTADO DE LIBROS */}
        <section className="admin-card">
          <div className="cardTitle d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2>Listado de libros</h2>
              <span className="hint">Hay {libros.length} registro(s).</span>
            </div>
            <div className="field m-0" style={{ minWidth: '250px' }}>
              <input type="text" placeholder="🔍 Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
          </div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th><th>Título</th><th>Autor</th><th>Año</th><th>Categoría</th><th>ISBN</th><th>Ejemplares</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {libros.length > 0 ? (
                  libros.map((libro) => (
                    <tr key={libro.id}>
                      <td>{libro.id}</td>
                      <td><strong>{libro.titulo}</strong></td>
                      <td>{libro.autor}</td>
                      <td>{libro.anioPublicacion || '—'}</td>
                      <td>{libro.categoria || '—'}</td>
                      <td>{libro.isbn || '—'}</td>
                      <td>
                        <span className={`pill ${libro.ejemplares > 0 ? 'ok' : 'warn'}`}>
                          {libro.ejemplares > 0 ? `${libro.ejemplares} disp.` : 'Agotado'}
                        </span>
                      </td>
                      <td className="tdActions">
                        <button className="mini" type="button" onClick={() => cargarParaEditar(libro)}>Editar</button>
                        <button className="mini danger" type="button" onClick={() => manejarEliminar(libro.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="8" className="emptyRow">No hay libros disponibles.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <ModalNotificacion 
        mostrar={modal.mostrar}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
        alCancelar={cerrarModal}
        alAceptar={modal.tipo === 'danger-confirm' ? confirmarEliminacion : cerrarModal}
      />
    </>
  );
}

export default AdminLibros;