import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Consultar la ruta /api a traves del puerto unico expuesto por HAProxy
  const API_URL = "/api";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setData(result);
      setHistory((prev) => [
        {
          id: prev.length + 1,
          time: new Date().toLocaleTimeString(),
          server: result.server_id,
          status: result.status,
        },
        ...prev.slice(0, 9), // Conservar las ultimas 10 peticiones
      ]);
    } catch (error) {
      console.error("Error al consultar el balanceador:", error);
      setData({ status: "error", message: "No se pudo conectar con HAProxy" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Panel de Balanceo de Carga (HAProxy)</h1>
      <p>Entrada única por el <strong>Puerto 80</strong> (Enrutamiento: <code>/</code> &rarr; Frontend | <code>/api</code> &rarr; Backends FastAPI)</p>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={fetchData} 
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Consultando...' : 'Hacer Petición HTTP (/api)'}
        </button>
      </div>

      {data && (
        <div style={{
          padding: '15px',
          borderRadius: '8px',
          backgroundColor: data.status === 'healthy' ? '#e6fffa' : '#ffebe6',
          border: `1px solid ${data.status === 'healthy' ? '#38b2ac' : '#e53e3e'}`,
          marginBottom: '20px'
        }}>
          <h3>Respuesta Actual del Backend:</h3>
          <p><strong>Servidor Atendió (Hostname):</strong> <code style={{ fontSize: '18px', color: '#2b6cb0' }}>{data.server_id || 'N/A'}</code></p>
          <p><strong>Estado:</strong> {data.status}</p>
          <p><strong>Mensaje:</strong> {data.message}</p>
        </div>
      )}

      <h3>Historial de Solicitudes (Verificación Round Robin)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc' }}>
            <th style={{ padding: '8px' }}>#</th>
            <th style={{ padding: '8px' }}>Hora</th>
            <th style={{ padding: '8px' }}>Servidor Atendió</th>
            <th style={{ padding: '8px' }}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{item.id}</td>
              <td style={{ padding: '8px' }}>{item.time}</td>
              <td style={{ padding: '8px' }}><code>{item.server}</code></td>
              <td style={{ padding: '8px' }}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;