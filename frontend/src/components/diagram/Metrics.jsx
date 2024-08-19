import React from 'react';

function Metrics({ data }) {

  const messages = [
    'Número Total de Eventos de Inicio del Modelo.',
    'Número Total de Eventos Intermedios del Modelo.',
    'Número Total de Eventos Finales del Modelo.',
    'Número Total de Tareas del Modelo.',
    'Número Total de Sub-Procesos Colapsados del Modelo.',
    'Número Total de Eventos del Modelo.',
    'Número Total de Decisiones/Uniones del Modelo.',
    'Número Total de Objetos de Datos en el Modelo.',
    'Nivel de Conectividad entre Actividades.',
    'Nivel de Conectividad entre Participantes.',
    'Proporción de Objetos de Datos como Producto entrante y el total de Objetos de Datos.',
    'Proporción de Objetos de Datos como Producto de salida y el total de Objetos de Datos.',
    'Proporción de Objetos de Datos como Producto de salida de Actividades del Modelo.',
    'Proporción Participantes y/o Carriles y las Actividades del Modelo.',
  ];


  return (
    <div style={{ width: '100%', padding: '0.6rem' }}>
      <table className="table table-bordered" style={{ fontSize: '10px' }}>
        <thead>
          <tr>
            <th>Métrica</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ cursor: 'pointer' }} title={messages[index]}>{item.attribute}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Metrics;