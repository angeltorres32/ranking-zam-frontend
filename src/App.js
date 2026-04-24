import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, User, RefreshCw } from "lucide-react";
import "./App.css";

function App() {
  const [ranking, setRanking] = useState([]);

  const fetchData = async () => {
    try {
      // Usamos la variable de entorno de Vercel o el link directo de Render como respaldo
      const apiUrl =
        process.env.REACT_APP_API_URL ||
        "https://ranking-zam-backend.onrender.com";
      const response = await axios.get(`${apiUrl}/ranking`);

      // El backend ya nos manda el ranking ordenado y con nombres reales
      setRanking(response.data || []);
    } catch (error) {
      console.error("Error al obtener datos del ranking:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresco cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const topThree = ranking.slice(0, 3);
  const remainder = ranking.slice(3);

  // Mantenemos tu lógica de orden para el podio (2do - 1ro - 3ro)
  const podiumOrder = [
    topThree[1] || null,
    topThree[0] || null,
    topThree[2] || null,
  ];

  return (
    <div className="ranking-zam-container">
      <header className="main-header">
        <div className="logo-section">
          <Trophy className="icon-trophy" />
          <div className="header-text">
            <h1>RANKING ZAM</h1>
            <p>ZAPATERÍAS ANA MARÍA</p>
          </div>
        </div>
        <div className="status-badge">
          <RefreshCw size={14} className="spin" /> LIVE
        </div>
      </header>

      <main className="content">
        <div className="podium-container">
          {podiumOrder.map((agent, index) => {
            if (!agent) return <div key={index} className="podium-space" />;
            const visualRank = index === 0 ? 2 : index === 1 ? 1 : 3;
            return (
              <div key={agent.id} className={`podium-card rank-${visualRank}`}>
                <div className="rank-tag">#{visualRank}</div>
                <div className="avatar-main">
                  <User size={visualRank === 1 ? 40 : 30} />
                </div>

                <div className="agent-info-container">
                  <div className="agent-name-main">{agent.nombreReal}</div>
                  <div className="agent-id-badge">ID: {agent.id}</div>
                </div>

                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-value">{agent.retornos}</span>
                    <span className="stat-label">RETORNOS</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat-box">
                    <span className="stat-value">{agent.boletos}</span>
                    <span className="stat-label">BOLETOS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="list-wrapper">
          {remainder.map((agent, index) => (
            <div key={agent.id} className="list-row-modern">
              <div className="row-rank">{index + 4}</div>
              <div className="row-user-box">
                <div className="row-name-main">{agent.nombreReal}</div>
                <div className="row-id-sub">{agent.id}</div>
              </div>
              <div className="row-stats-group">
                <div className="mini-stat">
                  <strong>{agent.retornos}</strong>
                  <span>RET</span>
                </div>
                <div className="mini-stat">
                  <strong>{agent.boletos}</strong>
                  <span>BOL</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
