import React from 'react';

function PillEstado({ estado, fechaVencimiento }) {
  const estadoActual = estado?.toLowerCase(); 
  const estaVencido = estadoActual === 'activo' && new Date() > new Date(fechaVencimiento);
  const textoEstado = estaVencido ? 'Vencido' : estado;
  const claseColor = estaVencido ? 'warn' : (estadoActual === 'activo' ? 'ok' : 'neutral');

  return (
    <span className={`pill ${claseColor}`}>
      {textoEstado}
    </span>
  );
}

export default PillEstado;