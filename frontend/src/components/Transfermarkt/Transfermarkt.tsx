import "./Transfermarkt.css";
import api from "../../api.ts";
import { useState, useEffect } from "react";

interface Spieler {
    id: number;
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
    const [wunschliste, setWunschliste] = useState<Spieler[]>([]);
    const [angebote, setAngebote] = useState<Spieler[]>([]);
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

        // Hier würden Sie normalerweise die Wunschliste und Angebote vom Server laden
        // Beispiel:
        // api.get(`/transfer/wunschliste?careername=${careername}`).then(...)
        // api.get(`/transfer/angebote?careername=${careername}`).then(...)
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

    const zurWunschlisteHinzufuegen = (spieler: Spieler) => {
        if (!wunschliste.some(s => s.id === spieler.id)) {
            setWunschliste([...wunschliste, spieler]);
            // Hier würden Sie normalerweise die Änderung an den Server senden
            // api.post('/transfer/wunschliste', { careername: localStorage.getItem("careername"), spielerId: spieler.id })
        }
    };

    const angebotAnnehmen = (spieler: Spieler) => {
        // Hier würde die Logik für das Annehmen eines Angebots implementiert werden
        alert(`Angebot für ${spieler.firstname} ${spieler.lastname} angenommen!`);
        setAngebote(angebote.filter(s => s.id !== spieler.id));
    };

    const angebotAblehnen = (spieler: Spieler) => {
        setAngebote(angebote.filter(s => s.id !== spieler.id));
        // Hier würden Sie normalerweise die Ablehnung an den Server senden
    };

    return (
        <div className="transfermarkt">
            <h2 className="tm-title">Transfermarkt</h2>

            <div className="three-column-layout">
                {/* Linke Spalte - Suchfilter und Ergebnisse */}
                <div className="column search-column">
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
                                {Array.from({length: 10}, (_, i) => i + 1).map((val) => (
                                    <option key={val} value={val}>
                                        {val}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-box">
                            <label>Max Rating</label>
                            <select value={maxRating} onChange={(e) => setMaxRating(Number(e.target.value))}>
                                {Array.from({length: 10}, (_, i) => i + 1).map((val) => (
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
                                <button
                                    className="add-to-wishlist"
                                    onClick={() => zurWunschlisteHinzufuegen(s)}
                                >
                                    Zur Wunschliste hinzufügen
                                </button>
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

                {/* Mittlere Spalte - Wunschliste */}
                <div className="column wishlist-column">
                    <h3>Wunschliste</h3>
                    {wunschliste.length === 0 ? (
                        <p className="no-results">Keine Spieler auf der Wunschliste</p>
                    ) : (
                        <div className="wishlist-items">
                            {wunschliste.map((s, idx) => (
                                <div key={idx} className="player-card">
                                    <h4>{s.firstname} {s.lastname}</h4>
                                    <div className="player-info">
                                        <span><strong>Wert:</strong> {Math.round(s.value / 1e6)} Mio €</span>
                                        <span><strong>Club:</strong> {s.clubname}</span>
                                    </div>
                                    <button
                                        className="remove-button"
                                        onClick={() => setWunschliste(wunschliste.filter(p => p.id !== s.id))}
                                    >
                                        Entfernen
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Rechte Spalte - Empfangene Angebote */}
                <div className="column offers-column">
                    <h3>Empfangene Angebote</h3>
                    {angebote.length === 0 ? (
                        <p className="no-results">Keine Angebote erhalten</p>
                    ) : (
                        <div className="offer-items">
                            {angebote.map((s, idx) => (
                                <div key={idx} className="player-card">
                                    <h4>{s.firstname} {s.lastname}</h4>
                                    <div className="player-info">
                                        <span><strong>Angebot:</strong> {Math.round(s.value / 1e6)} Mio €</span>
                                        <span><strong>Von:</strong> {s.clubname}</span>
                                    </div>
                                    <div className="offer-actions">
                                        <button
                                            className="accept-button"
                                            onClick={() => angebotAnnehmen(s)}
                                        >
                                            Annehmen
                                        </button>
                                        <button
                                            className="decline-button"
                                            onClick={() => angebotAblehnen(s)}
                                        >
                                            Ablehnen
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transfermarkt;