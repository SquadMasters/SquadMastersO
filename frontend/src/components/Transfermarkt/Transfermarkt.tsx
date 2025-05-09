import React, { useEffect, useState } from "react";
import "./Transfermarkt.css";
import api from "../../api.ts";

interface Spieler {
    firstname: string;
    lastname: string;
    position: string;
    value: number;
    rating: number;
    clubname: string;
    ageNow: number;
}

const Transfermarkt: React.FC = () => {
    const [alleSpieler, setAlleSpieler] = useState<Spieler[]>([]);
    const [name, setName] = useState("");
    const [club, setClub] = useState("");
    const [position, setPosition] = useState("");
    const [minRating, setMinRating] = useState(1);
    const [maxRating, setMaxRating] = useState(10);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(999999999);
    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 4;




    const uniqueClubs = Array.from(new Set(alleSpieler.map(s => s.clubname))).sort();
    const uniquePositions = Array.from(new Set(alleSpieler.map(s => s.position))).sort();

    useEffect(() => {
        const careername = localStorage.getItem("careername") || "";
        api
            .get(`/trainerCareerPlayer/allPlayersFromCareer?careername=${careername}`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setAlleSpieler(res.data);
                } else {
                    console.error("Unerwartetes Datenformat:", res.data);
                }
            })
            .catch((err) => console.error("Fehler beim Laden der Spieler", err));
    }, []);

    const filtered = alleSpieler.filter((s) => {
        return (
            (s.firstname + " " + s.lastname).toLowerCase().includes(name.toLowerCase()) &&
            (club === "" || s.clubname === club) &&
            (position === "" || s.position === position) &&
            s.rating >= minRating &&
            s.rating <= maxRating &&
            s.value >= minValue &&
            s.value <= maxValue
        );
    });

    const indexOfLast = currentPage * playersPerPage;
    const indexOfFirst = indexOfLast - playersPerPage;
    const currentPlayers = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / playersPerPage);

    return (
        <div className="transfermarkt">
            <h2 className="tm-title">Transfermarkt</h2>

            <div className="filter-grid">
                <div className="filter-box">
                    <label>Spielername</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Any"
                    />
                </div>

                <div className="filter-box">
                    <label>Club</label>
                    <select value={club} onChange={(e) => setClub(e.target.value)}>
                        <option value="">Alle</option>
                        {uniqueClubs.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <label>Position</label>
                    <select value={position} onChange={(e) => setPosition(e.target.value)}>
                        <option value="">Alle</option>
                        {uniquePositions.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <label>Min Rating</label>
                    <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <label>Max Rating</label>
                    <select value={maxRating} onChange={(e) => setMaxRating(Number(e.target.value))}>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-box">
                    <label>Min Value</label>
                    <input
                        type="number"
                        value={minValue}
                        onChange={(e) => setMinValue(Number(e.target.value))}
                    />
                </div>

                <div className="filter-box">
                    <label>Max Value</label>
                    <input
                        type="number"
                        value={maxValue}
                        onChange={(e) => setMaxValue(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="results">
                {filtered.length === 0 && <p className="no-results">Keine Spieler gefunden.</p>}
                {currentPlayers.map((s, idx) => (
                    <div key={idx} className="player-card">
                        <h3>{s.firstname} {s.lastname}</h3>
                        <div className="player-info">
                            <span><strong>Rating:</strong> {s.rating}</span>
                            <span><strong>Wert:</strong> {Math.round(s.value / 1e6)} Mio €</span>
                            <span><strong>Position:</strong> {s.position}</span>
                            <span><strong>Club:</strong> {s.clubname}</span>
                            <span><strong>Alter:</strong> {s.ageNow}</span>
                        </div>
                    </div>
                ))}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ◀
                        </button>
                        <span>Seite {currentPage} von {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            ▶
                        </button>
                    </div>
                )}


            </div>
        </div>
    );
};

export default Transfermarkt;
