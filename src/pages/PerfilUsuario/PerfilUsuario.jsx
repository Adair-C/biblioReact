import React, { useEffect, useState } from 'react';
import './PerfilUsuario.css'; 

const PerfilUsuario = ({ usuarioLogueado }) => {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true); // <--- IMPORTANTE: Agregado
  
  const { nombre, username, correo, rol, noControl, escuela } = usuarioLogueado;
  
  const esAlumno = rol === 'alumno';
  const esMaestro = rol === 'maestro';
  const esAdmin = rol === 'admin';

  useEffect(() => {
    const cargarLibros = async () => {
      try {
        const response = await fetch('http://localhost:5224/api/libros'); 
        if (!response.ok) throw new Error('Error al obtener libros');
        const data = await response.json();
        const ultimosCuatro = data
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

        setLibros(ultimosCuatro);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setCargando(false);
      }
    };

    if (esMaestro || esAdmin) {
      cargarLibros();
    } else {
      setCargando(false);
    }
  }, [esMaestro, esAdmin]);

  return (
    <main className="profile-page">
      <div className="container py-4 py-sm-5">
        <div className="row g-4">
          {/* ASIDE */}
          <div className="col-12 col-lg-3">
            <aside className="profile-sidebar">
              <div className="sidebar-user">
                <div className="sidebar-avatar">{nombre?.charAt(0).toUpperCase()}</div>
                <h2 className="sidebar-name">{nombre}</h2>
                <p className="sidebar-username">@{username}</p>
                <span className="role-badge">{rol.charAt(0).toUpperCase() + rol.slice(1)}</span>
              </div>
              
              <nav className="sidebar-menu">
                <a href="/perfil" className="sidebar-link active">Mi perfil</a>
                {(esMaestro || esAdmin) && <a href="/prestamos" className="sidebar-link">Gestionar Préstamos</a>}
                {(esMaestro || esAdmin) && <a href="/libros" className="sidebar-link">Gestionar libros</a>}
                {(esMaestro || esAdmin) && <a href="/reportes" className="sidebar-link">Gestionar Reportes</a>}
                <a href="/logout" className="sidebar-link logout-link">Cerrar sesión</a>
              </nav>
            </aside>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="col-12 col-lg-9">
            <section className="profile-card mb-4">
              <div className="profile-header">
                <div className="profile-avatar">{nombre?.charAt(0).toUpperCase()}</div>
                <div className="profile-main-info">
                  <p className="profile-kicker mb-2">Tu espacio personal</p>
                  <h1 className="profile-title mb-2">{nombre}</h1>
                </div>
              </div>

              <div className="profile-data-grid">
                <article className="info-box">
                  <h3>Usuario</h3>
                  <p>@{username}</p>
                </article>
                <article className="info-box">
                  <h3>Correo</h3>
                  <p>{correo}</p>
                </article>
                {esAlumno && (
                  <>
                    <article className="info-box">
                      <h3>No. de control</h3>
                      <p>{noControl || 'No disponible'}</p>
                    </article>
                    <article className="info-box">
                      <h3>Carrera / escuela</h3>
                      <p>{escuela || 'No disponible'}</p>
                    </article>
                  </>
                )}
              </div>
            </section>

            {/* SECCIÓN LIBROS (Visible solo para Maestro/Admin) */}
            {(esMaestro || esAdmin) && (
              <section className="mt-4">
                <h2 className="mb-3">Ultimos libros registrados en sistema</h2>
                {cargando ? (
                  <p>Cargando catálogo...</p>
                ) : (
                  <div className="row g-4">
                    {libros.map((libro) => (
                      <div key={libro.id} className="col-12 col-sm-6 col-md-4">
                        <article className="book-card p-3">
                          <img src={libro.portadaUrl} alt={libro.titulo} className="book-image mb-2" />
                          <h4 className="book-title">{libro.titulo}</h4>
                          <p className="book-meta">Autor: {libro.autor}</p>
                        </article>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PerfilUsuario;