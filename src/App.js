import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, User, RefreshCw } from "lucide-react";
import "./App.css";

const colaboradoresMaster = [
  { id: "104CGP", nombre: "Cristina Garcia Pineda" },
  { id: "113MCM", nombre: "Marisa Cortes Merino" },
  { id: "103MCV", nombre: "Michell Contreras Vazquez" },
  { id: "102RGJ", nombre: "Madian Rubi Gonzalez Juarez" },
  { id: "130LCM", nombre: "Lorena Cortez Merino" },
  { id: "207ASS", nombre: "Adriana Sanchez Sarmiento" },
  { id: "202LMP", nombre: "Leticia Moreno Pacheco" },
  { id: "887MJCC", nombre: "Maria Jose Coello Coello" },
  { id: "101MHA", nombre: "Maria Fernanda Hernandez Aguilar" },
  { id: "110KDH", nombre: "Karen Denise Hernandez Coello" },
  { id: "126MGMM", nombre: "Monica Guadalupe Moraleno Medrano" },
  { id: "764SST", nombre: "Sandra Sanchez Torres" },
  { id: "899JDNA", nombre: "Juan Diego Napoles Ancelmo" },
  { id: "201EOP", nombre: "Emmanuel Orduña Pacheco" },
  { id: "105MCM", nombre: "Mariana Contreras Merino" },
  { id: "203DMA", nombre: "Diana Mendoza Antonio" },
  { id: "116MAJZ", nombre: "Maria de los Angeles Jimenez Zaragoza" },
];

function App() {
  const [ranking, setRanking] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ranking");
      const datosExcel = response.data || [];

      const rankingCompleto = colaboradoresMaster.map((colab) => {
        const statsExcel = datosExcel.find(
          (item) =>
            item.nombre.toUpperCase().trim() === colab.id.toUpperCase().trim(),
        );
        return {
          id: colab.id,
          nombreReal: colab.nombre,
          retornos: statsExcel ? statsExcel.retornos : 0,
          boletos: statsExcel ? statsExcel.boletos : 0,
        };
      });

      rankingCompleto.sort((a, b) => {
        if (b.retornos !== a.retornos) return b.retornos - a.retornos;
        return b.boletos - a.boletos;
      });

      setRanking(rankingCompleto);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const topThree = ranking.slice(0, 3);
  const remainder = ranking.slice(3);
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

                {/* --- CAMBIO AQUÍ: NOMBRES SEPARADOS --- */}
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
