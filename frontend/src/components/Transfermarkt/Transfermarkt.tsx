import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transfermarkt.css';

interface Player {
    playerId: number;
    firstname: string;
    lastname: string;
    position?: string;
    value: number;
    rating: number;
    clubname?: string;
    ageNow: number;
}

interface Offer extends Player {
    clubWithOffer: string;
}

interface BudgetDTO {
    budget: number;
}

const Transfermarkt = () => {
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [playersWithOffers, setPlayersWithOffers] = useState<Player[]>([]);
    const [incomingOffers, setIncomingOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [budget, setBudget] = useState<number>(0);
    const [offerLoading, setOfferLoading] = useState<number | null>(null);
    const [cancelLoading, setCancelLoading] = useState<number | null>(null);
    const [filter, setFilter] = useState<string>('');
    const [clubFilter, setClubFilter] = useState<string>('');
    const [minRating, setMinRating] = useState<number>(0);
    const [maxAge, setMaxAge] = useState<number>(99);
    const [allClubs, setAllClubs] = useState<string[]>([]);

    const username = localStorage.getItem("username") || "";
    const careername = localStorage.getItem("careername") || "";
    const clubname = JSON.parse(localStorage.getItem("selectedTeam") || "{}").name || "";

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [budgetRes, playersRes, sentOffersRes, receivedOffersRes] = await Promise.all([
                    axios.get<BudgetDTO>(`http://localhost:8080/trainerCareer/budget/${clubname}/${careername}`),
                    axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersForTransfermarket`, { params: { username, careername } }),
                    axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersOnWishlist`, { params: { username, careername } }),
                    axios.get<Offer[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`, { params: { username, careername } }),
                ]);

                setBudget(budgetRes.data.budget);
                setAvailablePlayers(playersRes.data);
                setPlayersWithOffers(sentOffersRes.data);
                setIncomingOffers(receivedOffersRes.data);
                setAllClubs([...new Set(playersRes.data.map(p => p.clubname).filter(Boolean))] as string[]);
            } catch (err) {
                setError('Fehler beim Laden der Daten.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username, careername, clubname]);

    const formatPlayerName = (player: Player) => `${player.firstname} ${player.lastname}`;

    const formatCurrency = (value: number) => new Intl.NumberFormat('de-DE', {
        style: 'currency', currency: 'EUR', maximumFractionDigits: 0
    }).format(value);

    const handleSendOffer = async (playerId: number) => {
        try {
            setOfferLoading(playerId);
            const offerResponse = await axios.post<string>(
                `http://localhost:8080/salesInquiry/sendOffer`,
                null,
                { params: { clubname, careername, playerId } }
            );

            if (offerResponse.data === "success") {
                const transferResult = await axios.post<boolean>(
                    `http://localhost:8080/trainerCareerPlayer/transferPlayer`,
                    null,
                    { params: { clubname, careername, playerId, targetClub: clubname } }
                );

                if (!transferResult.data) throw new Error("Transfer fehlgeschlagen");
                localStorage.setItem("reloadTeamBuild", "true");
            }

            const [playersRes, sentOffersRes, budgetRes, receivedOffersRes] = await Promise.all([
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersForTransfermarket`, { params: { username, careername } }),
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersOnWishlist`, { params: { username, careername } }),
                axios.get<BudgetDTO>(`http://localhost:8080/trainerCareer/budget/${clubname}/${careername}`),
                axios.get<Offer[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`, { params: { username, careername } }),
            ]);

            setAvailablePlayers(playersRes.data);
            setPlayersWithOffers(sentOffersRes.data);
            setBudget(budgetRes.data.budget);
            setIncomingOffers(receivedOffersRes.data);
        } catch (err) {
            setError('Fehler beim Kauf');
        } finally {
            setOfferLoading(null);
        }
    };

    const handleDeleteOffer = async (playerId: number) => {
        try {
            setCancelLoading(playerId);
            await axios.delete<boolean>(`http://localhost:8080/salesInquiry/deleteOffer`, {
                params: { careername, playerId }
            });

            const [playersRes, sentOffersRes, budgetRes, receivedOffersRes] = await Promise.all([
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersForTransfermarket`, { params: { username, careername } }),
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersOnWishlist`, { params: { username, careername } }),
                axios.get<BudgetDTO>(`http://localhost:8080/trainerCareer/budget/${clubname}/${careername}`),
                axios.get<Offer[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`, { params: { username, careername } }),
            ]);

            setAvailablePlayers(playersRes.data);
            setPlayersWithOffers(sentOffersRes.data);
            setBudget(budgetRes.data.budget);
            setIncomingOffers(receivedOffersRes.data);
        } catch (err) {
            setError('Angebot konnte nicht gelöscht werden');
        } finally {
            setCancelLoading(null);
        }
    };

    const handleRejectOffer = async (playerId: number) => {
        try {
            await axios.delete(`http://localhost:8080/salesInquiry/deleteOffer`, {
                params: { careername, playerId }
            });

            const receivedOffersRes = await axios.get<Offer[]>(
                `http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`,
                { params: { username, careername } }
            );

            setIncomingOffers(receivedOffersRes.data);
        } catch (err) {
            setError("Angebot konnte nicht abgelehnt werden.");
        }
    };

    const handleAcceptOffer = async (playerId: number, targetClub: string) => {
        try {
            const response = await axios.post<boolean>(
                `http://localhost:8080/trainerCareerPlayer/transferPlayer`,
                null,
                { params: { clubname, careername, playerId, targetClub } }
            );

            if (!response.data) throw new Error("Transfer fehlgeschlagen");
            const receivedOffersRes = await axios.get<Offer[]>(
                `http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`,
                { params: { username, careername } }
            );

            setIncomingOffers(receivedOffersRes.data);
            localStorage.setItem("reloadTeamBuild", "true");
        } catch (err) {
            setError("Angebot konnte nicht angenommen werden.");
        }
    };

    const filteredPlayers = availablePlayers.filter(p => {
        return (!filter || p.position === filter)
            && (!clubFilter || p.clubname === clubFilter)
            && p.rating >= minRating
            && p.ageNow <= maxAge;
    });

    if (loading) return <div className="loading-message">Daten werden geladen...</div>;

    return (
        <div className="transfermarkt-container">
            <h1>Transfermarkt</h1>
            <div className="header-section">
                <div className="budget-team-display">

                    <div className="team-badge">
                        <span className="team-label">Team</span>
                        <span className="team-value">{clubname}</span>
                    </div>
                    <div className="budget-badge">
                        <span className="budget-label">Budget</span>
                        <span className="budget-value">{formatCurrency(budget)}</span>
                    </div>
                </div>


                {error && <div className="error-message">{error}</div>}

                <div className="filter-bar">
                    <div className="filter-group">
                        <label>Position: </label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Alle</option>
                            {['TW', 'IV', 'LV', 'RV', 'ZM', 'ZDM', 'OM', 'LF', 'RF', 'ST'].map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Verein: </label>
                        <select value={clubFilter} onChange={e => setClubFilter(e.target.value)}>
                            <option value="">Alle</option>
                            {allClubs.map(club => (
                                <option key={club} value={club}>{club}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Min. Bewertung: </label>
                        <input
                            type="number"
                            min={0}
                            max={10}
                            value={minRating}
                            onChange={e => setMinRating(Number(e.target.value))}
                        />
                    </div>

                    <div className="filter-group">
                        <label>Max. Alter: </label>
                        <input
                            type="number"
                            min={1}
                            max={99}
                            value={maxAge}
                            onChange={e => setMaxAge(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="transfermarkt-grid">
                <div className="players-column">
                    <h2>Verfügbare Spieler ({filteredPlayers.length})</h2>
                    <div className="players-list">
                        {filteredPlayers.map(player => (
                            <div key={player.playerId} className="player-card">
                                <div className="player-info">
                                    <div className="player-name">{formatPlayerName(player)}</div>
                                    <div className="player-details">
                                        <span>{player.position}</span>
                                        <span>{player.clubname}</span>
                                        <span>{formatCurrency(player.value)}</span>
                                        <span>Bewertung: {player.rating}/10</span>
                                        <span>Alter: {player.ageNow}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSendOffer(player.playerId)}
                                    disabled={offerLoading === player.playerId || player.value > budget}
                                    className={player.value > budget ? "disabled-btn" : ""}
                                >
                                    {offerLoading === player.playerId ? 'Wird gesendet...' : 'Kaufen'}
                                </button>
                                {player.value > budget && <div className="budget-warning">Budget zu niedrig</div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="offers-column">
                    <div className="offers-section">
                        <h2>Gesendete Angebote ({playersWithOffers.length})</h2>
                        <div className="offers-list">
                            {playersWithOffers.map(player => (
                                <div key={player.playerId} className="offer-card">
                                    <div className="player-info">
                                        <div className="player-name">{formatPlayerName(player)}</div>
                                        <div className="player-details">
                                            <span>{player.position}</span>
                                            <span>{player.clubname}</span>
                                            <span>{formatCurrency(player.value)}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteOffer(player.playerId)}
                                        disabled={cancelLoading === player.playerId}
                                        className="cancel-btn"
                                    >
                                        {cancelLoading === player.playerId ? 'Wird zurückgezogen...' : 'Angebot zurückziehen'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="offers-section">
                        <h2>Erhaltene Angebote ({incomingOffers.length})</h2>
                        <div className="offers-list">
                            {incomingOffers.map(player => (
                                <div key={player.playerId} className="offer-card">
                                    <div className="player-info">
                                        <div className="player-name">{formatPlayerName(player)}</div>
                                        <div className="offer-details">
                                            <span>Von: {player.clubWithOffer}</span>
                                            <span>{formatCurrency(player.value)}</span>
                                            <span>Bewertung: {player.rating}/10</span>
                                        </div>
                                    </div>
                                    <div className="offer-actions">
                                        <button
                                            onClick={() => handleAcceptOffer(player.playerId, player.clubWithOffer)}
                                            className="accept-btn"
                                        >
                                            Annehmen
                                        </button>
                                        <button
                                            onClick={() => handleRejectOffer(player.playerId)}
                                            className="reject-btn"
                                        >
                                            Ablehnen
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transfermarkt;
