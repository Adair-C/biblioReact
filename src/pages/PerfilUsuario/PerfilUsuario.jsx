import React, { useEffect, useState } from 'react';
import './PerfilUsuario.css'; // Asegúrate de tener tus estilos aquí

const PerfilUsuario = ({ usuarioLogueado }) => {
  const [libros, setLibros] = useState([]);
  
  // Destructuración de datos del usuario
  const { nombre, username, correo, rol, noControl, escuela, descripcion } = usuarioLogueado;
  
  const esAlumno = rol === 'alumno';
  const esMaestro = rol === 'maestro';
  const esAdmin = rol === 'admin';

  // Simulación de carga de datos desde tu WebAPI
  useEffect(() => {
    if (esMaestro || esAdmin) {
      // Aquí realizarías tu llamada fetch a tu API de .NET
      // fetch('https://tu-api.com/api/libros/recientes')
    }
  }, [esMaestro, esAdmin]);

  return (
    <main className="profile-page">
      <div className="container py-4 py-sm-5">
        <div className="row g-4">
          {/* ASIDE (Navegación lateral) */}
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
                {esMaestro && <a href="/prestamos" className="sidebar-link">Gestionar Préstamos</a>}
                {(esMaestro || esAdmin) && <a href="/libros" className="sidebar-link">Gestionar libros</a>}
                <a href="/logout" className="sidebar-link logout-link">Cerrar sesión</a>
              </nav>
            </aside>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="col-12 col-lg-9">
            <section className="profile-card">
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default PerfilUsuario;