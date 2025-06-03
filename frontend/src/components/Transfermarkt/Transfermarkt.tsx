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
    potential?: number;
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
                setError('');
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
                { params: { username, careername, playerId } }
            );

            if (offerResponse.data === "success") {
                const transferResult = await axios.post<boolean>(
                    `http://localhost:8080/trainerCareerPlayer/transferPlayer`,
                    null,
                    { params: { username, careername, playerId, targetClub: clubname } }
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
                {
                    params: {
                        username,
                        careername,
                        playerId,
                        targetClub
                    }
                }
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

    if (loading) return <div className="loading-message">Daten werden geladen...</div>;

    return (
        <div className="transfermarkt-style">
            <div className="transfermarkt-container">
                <h1>Transfermarkt</h1>
                <div className="budget-display">
                    Aktuelles Budget: {formatCurrency(budget)}
                    <div className="team-info">Team: {clubname}</div>
                </div>

                <div className="filter-bar">
                    <label>Position filtern: </label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="">Alle</option>
                        {['TW', 'IV', 'LV', 'RV', 'ZM', 'ZDM', 'OM', 'LF', 'RF', 'ST'].map(pos => (
                            <option key={pos} value={pos}>{pos}</option>
                        ))}
                    </select>
                </div>

                <div className="transfermarkt-grid">
                    <div className="section">
                        <h2>Verfügbare Spieler ({availablePlayers.length})</h2>
                        <div className="player-list scrollable">
                            {availablePlayers.filter(p => !filter || p.position === filter).map(player => (
                                <div key={player.playerId} className="player-card">
                                    <div className="player-name">{formatPlayerName(player)}</div>
                                    <div className="player-position">{player.position}</div>
                                    <div className="player-club">{player.clubname}</div>
                                    <div className="player-value">{formatCurrency(player.value)}</div>
                                    <div className="player-rating">Bewertung: {player.rating}/10</div>
                                    <div className="player-age">Alter: {player.ageNow}</div>
                                    <div className="player-potential">Potenzial: {player.potential}</div>
                                    <button onClick={() => handleSendOffer(player.playerId)} disabled={offerLoading === player.playerId || player.value > budget}>
                                        {offerLoading === player.playerId ? 'Wird gesendet...' : 'Kaufen'}
                                    </button>
                                    {player.value > budget && <div className="insufficient-budget">Budget zu niedrig</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Gesendete Angebote ({playersWithOffers.length})</h2>
                        <div className="player-list scrollable">
                            {playersWithOffers.map(player => (
                                <div key={player.playerId} className="player-card">
                                    <div className="player-name">{formatPlayerName(player)}</div>
                                    <div className="player-position">{player.position}</div>
                                    <div className="player-club">{player.clubname}</div>
                                    <div className="player-value">{formatCurrency(player.value)}</div>
                                    <div className="player-rating">Bewertung: {player.rating}/10</div>
                                    <button onClick={() => handleDeleteOffer(player.playerId)} disabled={cancelLoading === player.playerId}>
                                        {cancelLoading === player.playerId ? 'Wird zurückgezogen...' : 'Angebot zurückziehen'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="section">
                        <h2>Erhaltene Angebote ({incomingOffers.length})</h2>
                        <div className="player-list scrollable">
                            {incomingOffers.map(player => (
                                <div key={player.playerId} className="player-card">
                                    <div className="player-name">{formatPlayerName(player)}</div>
                                    <div className="player-club">Angebot von: {player.clubWithOffer}</div>
                                    <div className="player-value">{formatCurrency(player.value)}</div>
                                    <div className="player-rating">Bewertung: {player.rating}/10</div>
                                    <div className="player-age">Alter: {player.ageNow}</div>
                                    <div className="offer-actions">
                                        <button onClick={() => handleAcceptOffer(player.playerId, player.clubWithOffer)}>
                                            Annehmen
                                        </button>
                                        <button onClick={() => handleRejectOffer(player.playerId)}>
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
