import { useState } from 'react';
import './Password.css';

function Password(props) {
  const [type, setType] = useState(props.estadoInicial === 'Ver' ? 'text' : 'password');
  const [textoBoton, setTextoBoton] = useState(props.estadoInicial === 'Ver' ? 'Ocultar' : 'Ver');

  const clickVisibilidad = () => {
    if (type === 'password') {
      setType('text');
      setTextoBoton('Ocultar');
    } else {
      setType('password');
      setTextoBoton('Ver');
    }
  };

  return (
    <div className="password-wrapper">
      <input 
        type={type} 
        className="password-field-input" 
        value={props.valorInicial}
        onChange={(e) => props.cambioPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <button type="button" className="password-toggle-btn" onClick={clickVisibilidad}>
        {textoBoton}
      </button>
    </div>
  );
}

export default Password;