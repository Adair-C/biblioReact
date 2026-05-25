import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar({ usuarioLogueado, alCerrarSesion }) {
  const esAdmin = usuarioLogueado?.rol?.toLowerCase() === 'admin';
  const esMaestro = usuarioLogueado?.rol?.toLowerCase() === 'maestro';
  const esAlumno = usuarioLogueado?.rol?.toLowerCase() === 'alumno';

  return (
    <nav className="custom-nav">
      <div className="nav-container">
        <div className="nav-left">
          <span className="nav-brand">BIBLIO+</span>
        </div>

        <div className="nav-center">
            <ul className="nav-links">
              <li><NavLink to="/inicio">Inicio</NavLink></li>
              
              {/* Solo Admin y Maestro pueden gestionar libros */}
              {(esAdmin || esMaestro) && (<li><NavLink to="/libros">Gestionar Libros</NavLink></li>)}
              
              <li><NavLink to="/prestamos">Gestionar Prestamos</NavLink></li>
              
              {/* 🔥 CAMBIO AQUÍ: Cambiado a /reportes y protegido para que solo lo vea Admin o Maestro */}
              {(esAdmin || esMaestro) && (<li><NavLink to="/reportes">Estadísticas</NavLink></li>)}
              
              <li><NavLink to="/perfil">Mi perfil</NavLink></li>
            </ul>
        </div>

        <div className="nav-right">
          <div className="user-info">
            <span className="user-name">{usuarioLogueado?.nombre || 'Usuario'}</span>
          </div>
          <button className="btn-logout" onClick={alCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;