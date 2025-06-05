import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transfermarkt.css';
import arsenal from "../../assets/arsenalwappen.png";
import atletico from "../../assets/atleticowappen.png";
import barca from "../../assets/barcawappen.png";
import bayern from "../../assets/bayernwappen.png";
import city from "../../assets/citywappen.png";
import inter from "../../assets/interwappen.png";
import juve from "../../assets/juve.png";
import liverpool from "../../assets/liverpool.png";
import milan from "../../assets/milan.png";
import psg from "../../assets/psgwappen.png";
import real from "../../assets/reallogo.png";



const logoMap: { [key: string]: string } = {
    'Arsenal': arsenal,
    'Atlético Madrid': atletico,
    'FC Barcelona': barca,
    'Bayern München': bayern,
    'Manchester City': city,
    'Inter Mailand': inter,
    'Juventus Turin': juve,
    'Liverpool': liverpool,
    'AC Mailand': milan,
    'Paris Saint-Germain': psg,
    'Real Madrid': real,
};

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

const teamColorMap: { [key: string]: string[] } = {
    Arsenal: ['#E30613', '#C8102E', '#9B1B30'],
    'Atlético Madrid': ['#C8102E', '#003B5C', '#FFFFFF'],
    'FC Barcelona': ['#A50021', '#004D98'],
    'Bayern München': ['#D50032', '#FFFFFF'],
    'Manchester City': ['#3E8FC7', '#FFFFFF'],
    'Inter Mailand': ['#003DA5', '#FFFFFF'],
    'Juventus Turin': ['#000000', '#FFFFFF'],
    Liverpool: ['#C8102E', '#00B5A0'],
    'AC Mailand': ['#9C1B29', '#FFFFFF'],
    'Paris Saint-Germain': ['#0060A9', '#E30613'],
    'Real Madrid': ['#D4AF37', '#FFFFFF'],
};

const Transfermarkt: React.FC = () => {
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
    const [onlyAffordable, setOnlyAffordable] = useState<boolean>(false);


    const username = localStorage.getItem('username') || '';
    const careername = localStorage.getItem('careername') || '';
    const selectedTeamName = JSON.parse(localStorage.getItem('selectedTeam') || '{}').name || '';

    // Teamfarbe aus Map oder Default Blau
    const primaryColor = teamColorMap[selectedTeamName]?.[0] || '#1e88e5';

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [budgetRes, playersRes, sentOffersRes, receivedOffersRes] = await Promise.all([
                    axios.get<BudgetDTO>(`http://localhost:8080/trainerCareer/budget/${selectedTeamName}/${careername}`),
                    axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersForTransfermarket`, { params: { username, careername } }),
                    axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersOnWishlist`, { params: { username, careername } }),
                    axios.get<Offer[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`, { params: { username, careername } }),
                ]);

                setBudget(budgetRes.data.budget);
                setAvailablePlayers(playersRes.data);
                setPlayersWithOffers(sentOffersRes.data);
                setIncomingOffers(receivedOffersRes.data);
                setAllClubs([...new Set(playersRes.data.map((p) => p.clubname).filter(Boolean))] as string[]);
            } catch {
                setError('Fehler beim Laden der Daten.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username, careername, selectedTeamName]);

    const formatPlayerName = (player: Player) => `${player.firstname} ${player.lastname}`;

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

    const getPrimaryTeamColor = (club: string | undefined): string => {
        if (!club) return primaryColor;
        const colors = teamColorMap[club];
        return colors ? colors[0] : primaryColor;
    };

    const handleSendOffer = async (playerId: number) => {
        try {
            setOfferLoading(playerId);
            const offerResponse = await axios.post<string>(
                `http://localhost:8080/salesInquiry/sendOffer`,
                null,
                { params: { clubname: selectedTeamName, careername, playerId } }
            );

            if (offerResponse.data === 'success') {
                const transferResult = await axios.post<boolean>(
                    `http://localhost:8080/trainerCareerPlayer/transferPlayer`,
                    null,
                    { params: { clubname, careername, playerId } }
                );
                if (!transferResult.data) throw new Error('Transfer fehlgeschlagen');
                localStorage.setItem('reloadTeamBuild', 'true');
            }

            const [playersRes, sentOffersRes, budgetRes, receivedOffersRes] = await Promise.all([
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersForTransfermarket`, {
                    params: { username, careername },
                }),
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersOnWishlist`, { params: { username, careername } }),
                axios.get<BudgetDTO>(`http://localhost:8080/trainerCareer/budget/${selectedTeamName}/${careername}`),
                axios.get<Offer[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`, { params: { username, careername } }),
            ]);
            setAvailablePlayers(playersRes.data);
            setPlayersWithOffers(sentOffersRes.data);
            setBudget(budgetRes.data.budget);
            setIncomingOffers(receivedOffersRes.data);
        } catch {
            setError('Fehler beim Kauf');
        } finally {
            setOfferLoading(null);
        }
    };

    const handleDeleteOffer = async (playerId: number) => {
        try {
            setCancelLoading(playerId);
            await axios.delete<boolean>(`http://localhost:8080/salesInquiry/deleteSentOffers`, {
                params: { username, careername, playerId },
            });

            const [playersRes, sentOffersRes, budgetRes, receivedOffersRes] = await Promise.all([
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersForTransfermarket`, {
                    params: { username, careername },
                }),
                axios.get<Player[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersOnWishlist`, { params: { username, careername } }),
                axios.get<BudgetDTO>(`http://localhost:8080/trainerCareer/budget/${selectedTeamName}/${careername}`),
                axios.get<Offer[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`, { params: { username, careername } }),
            ]);
            setAvailablePlayers(playersRes.data);
            setPlayersWithOffers(sentOffersRes.data);
            setBudget(budgetRes.data.budget);
            setIncomingOffers(receivedOffersRes.data);
        } catch {
            setError('Angebot konnte nicht gelöscht werden');
        } finally {
            setCancelLoading(null);
        }
    };

    const handleRejectOffer = async (playerId: number) => {
        try {
            await axios.delete(`http://localhost:8080/salesInquiry/deleteReceivedOffers`, {
                params: { clubname: selectedTeamName, careername, playerId },
            });
            const receivedOffersRes = await axios.get<Offer[]>(`http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`, {
                params: { username, careername },
            });
            setIncomingOffers(receivedOffersRes.data);
        } catch {
            setError('Angebot konnte nicht abgelehnt werden.');
        }
    };

    const handleAcceptOffer = async (playerId: number, buyerClub: string) => {
        try {
            const response = await axios.post<boolean>(
                `http://localhost:8080/trainerCareerPlayer/transferPlayer`,
                null,
                { params: { clubname: buyerClub, careername, playerId, targetClub: selectedTeamName } }
            );

            if (!response.data) throw new Error("Transfer fehlgeschlagen");

            const receivedOffersRes = await axios.get<Offer[]>(
                `http://localhost:8080/trainerCareerPlayer/allPlayersWithOffer`,
                { params: { username, careername } }
            );

            setIncomingOffers(receivedOffersRes.data);
            localStorage.setItem('reloadTeamBuild', 'true');
        } catch {
            setError('Angebot konnte nicht angenommen werden.');
        }
    };

    const filteredPlayers = availablePlayers.filter(
        (p) =>
            (!filter || p.position === filter) &&
            (!clubFilter || p.clubname === clubFilter) &&
            p.rating >= minRating &&
            p.ageNow <= maxAge &&
            (!onlyAffordable || p.value <= budget)
    );


    if (loading)
        return (
            <div
                className="loading-message"
                style={{ color: primaryColor, fontWeight: '700', fontSize: '18px', textAlign: 'center', marginTop: '40px' }}
            >
                Daten werden geladen...
            </div>
        );

    return (
        <div className="transfermarkt-container" style={{ ['--primary-color' as any]: primaryColor }}>
            <h1 style={{color:primaryColor}}>Transfermarkt</h1>

            <div className="header-section">
                <div className="budget-team-display">
                    <div className="team-badge">
                        <span className="team-label">Team</span>
                        <span className="team-value">{selectedTeamName}</span>
                    </div>
                    <div className="budget-badge">
                        <span className="budget-label">Budget</span>
                        <span className="budget-value">{formatCurrency(budget)}</span>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                <div className="filter-bar">
                    <div className="filter-group affordable-toggle">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={onlyAffordable}
                                onChange={() => setOnlyAffordable(!onlyAffordable)}
                            />
                            <span className="custom-checkbox">{onlyAffordable ? '✕' : ''}</span>
                            Nur Spieler im Budget
                        </label>
                    </div>


                    <div className="filter-group">
                        <label>Position:</label>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Alle</option>
                            {['TW', 'IV', 'LV', 'RV', 'ZM', 'ZDM', 'OM', 'LF', 'RF', 'ST'].map((pos) => (
                                <option key={pos} value={pos}>
                                    {pos}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Verein:</label>
                        <select value={clubFilter} onChange={(e) => setClubFilter(e.target.value)}>
                            <option value="">Alle</option>
                            {allClubs.map((club) => (
                                <option key={club} value={club}>
                                    {club}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Min. Bewertung:</label>
                        <input type="number" min={0} max={10} value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} />
                    </div>
                    <div className="filter-group">
                        <label>Max. Alter:</label>
                        <input type="number" min={1} max={99} value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} />
                    </div>


                </div>
            </div>
            <div className="transfermarkt-grid">
                <section className="players-column">
                    <h2 style={{ color: primaryColor }}>Verfügbare Spieler ({filteredPlayers.length})</h2>
                    <div className="players-list">
                        {filteredPlayers.map((player) => (
                            <article key={player.playerId} className="player-card upgraded-card">
                                <div className="player-left">
                                    <div className="player-name-row">
                                        <h3 className="player-name">{formatPlayerName(player)}</h3>
                                        <span className="position-badge">{player.position}</span>
                                    </div>
                                    <div className="player-stats">
                                        <div className="stat-block">
                                            <label>Verein</label>
                                            {player.clubname && logoMap[player.clubname] ? (
                                                <img src={logoMap[player.clubname]} alt={player.clubname} className="club-logo" />
                                            ) : (
                                                <span>{player.clubname}</span>
                                            )}
                                        </div>

                                        <div className="stat-block"><label>Wert</label><span>{formatCurrency(player.value)}</span></div>
                                        <div className="stat-block"><label>Bewertung</label><span>{player.rating}/10</span></div>
                                        <div className="stat-block"><label>Alter</label><span>{player.ageNow}</span></div>
                                    </div>
                                </div>
                                <div className="player-right">
                                    <button
                                        onClick={() => handleSendOffer(player.playerId)}
                                        disabled={offerLoading === player.playerId || player.value > budget}
                                        className={player.value > budget ? 'disabled-btn' : ''}
                                        style={{ backgroundColor: primaryColor,  borderRadius:10}}
                                    >
                                        {offerLoading === player.playerId ? 'Wird gesendet...' : 'Kaufen'}
                                    </button>
                                    {player.value > budget && (
                                        <p className="budget-warning enhanced-budget-warning">Nicht genug Budget</p>
                                    )}
                                </div>
                            </article>



                        ))}
                    </div>
                </section>
                <aside className="offers-column">
                    <div className="offers-section">
                        <h2 style={{ color: primaryColor }}>Gesendete Angebote ({playersWithOffers.length})</h2>
                        <div className="offers-list">
                            {playersWithOffers.map((player) => {
                                const color = getPrimaryTeamColor(player.clubname);
                                return (
                                    <article key={player.playerId} className="offer-card" style={{ borderColor: color }}>
                                        <div className="player-info" style={{ color }}>
                                            <h3 className="player-name">{formatPlayerName(player)}</h3>
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
                                            style={{ borderRadius: 24 }}
                                        >
                                            {cancelLoading === player.playerId ? 'Wird zurückgezogen...' : 'Angebot zurückziehen'}
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                    <div className="offers-section">
                        <h2 style={{ color: primaryColor }}>Erhaltene Angebote ({incomingOffers.length})</h2>
                        <div className="offers-list">
                            {incomingOffers.map((offer) => {
                                const color = getPrimaryTeamColor(offer.clubWithOffer);
                                return (
                                    <article key={offer.playerId} className="offer-card" style={{ borderColor: color }}>
                                        <div className="player-info" style={{ color }}>
                                            <h3 className="player-name">{formatPlayerName(offer)}</h3>
                                            <div className="offer-details">
                                                <span>Von: {offer.clubWithOffer}</span>
                                                <span>{formatCurrency(offer.value)}</span>
                                                <span>Bewertung: {offer.rating}/10</span>
                                            </div>
                                        </div>
                                        <div className="offer-actions">
                                            <button
                                                onClick={() => handleAcceptOffer(offer.playerId, offer.clubWithOffer)}
                                                className="accept-btn"
                                                style={{ backgroundColor: color, borderRadius: 24 }}
                                            >
                                                Annehmen
                                            </button>
                                            <button
                                                onClick={() => handleRejectOffer(offer.playerId)}
                                                className="reject-btn"
                                                style={{ borderRadius: 24 }}
                                            >
                                                Ablehnen
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Transfermarkt;
