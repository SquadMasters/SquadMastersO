import React, { useState, useEffect, useRef } from 'react';
import './Simulation.css';
import axios from 'axios';
import arsenal from '../../assets/arsenalwappen.png';
import atletico from '../../assets/atleticowappen.png';
import barca from '../../assets/barcawappen.png';
import bayern from '../../assets/bayernwappen.png';
import city from '../../assets/citywappen.png';
import inter from '../../assets/interwappen.png';
import juve from '../../assets/juve.png';
import liverpool from '../../assets/liverpool.png';
import milan from '../../assets/milan.png';
import psg from '../../assets/psgwappen.png';
import real from '../../assets/reallogo.png';

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
    rating: number;
    firstname: string;
    lastname: string;
    position: string;
    ageNow: number;
    value: number;
}

interface Team {
    name: string;
    logo: string;
    players: Player[];
    goals: number;
}

const Simulation: React.FC = () => {
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [awayTeam, setAwayTeam] = useState<Team | null>(null);
    const [minute, setMinute] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [events, setEvents] = useState<string[]>([]);
    const [lastEvent, setLastEvent] = useState<string>('');
    const eventLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedCareer = JSON.parse(localStorage.getItem('career') || '{}');
        const userTeam: Team = {
            name: storedCareer.team.name,
            logo: logoMap[storedCareer.team.name] || '',
            goals: 0,
            players: storedCareer.team.players || [],
        };

        const loadOpponent = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/trainerCareer/tableDataByCareer/${storedCareer.careerName}`);
                const others = res.data.filter((t: any) => t.clubName !== userTeam.name);
                const opponentName = others[Math.floor(Math.random() * others.length)].clubName;

                const opponentTeam: Team = {
                    name: opponentName,
                    logo: logoMap[opponentName] || '',
                    goals: 0,
                    players: [], // Spieler werden später geladen
                };

                // Hole die Spieler für das Gegnerteam
                const playersRes = await axios.get('http://localhost:8080/trainerCareerPlayer/allPlayersFromTrainerCareer', {
                    params: {
                        username: storedCareer.username,
                        careername: storedCareer.careerName,
                    }
                });




                opponentTeam.players = playersRes.data.map((player: any) => ({
                    rating: player.rating,
                    firstname: player.firstname,
                    lastname: player.lastname,
                    position: player.position,
                    ageNow: player.ageNow,
                    value: player.value,
                }));

                setHomeTeam(userTeam);
                setAwayTeam(opponentTeam);

                localStorage.setItem('opponentTeamLogo', opponentTeam.logo);
                localStorage.setItem('opponentTeamName', opponentTeam.name);
            } catch (err) {
                console.error("Fehler beim Laden des Gegnerteams", err);
            }
        };

        loadOpponent();
    }, []);

    const startSimulation = () => {
        setIsPlaying(true);
        setMinute(0);
        setEvents([]);
        setLastEvent('');
        if (homeTeam) setHomeTeam({ ...homeTeam, goals: 0 });
        if (awayTeam) setAwayTeam({ ...awayTeam, goals: 0 });
    };

    useEffect(() => {
        if (!isPlaying || minute >= 90 || !homeTeam || !awayTeam) return;

        const interval = setInterval(() => {
            setMinute((m) => m + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, minute]);

    useEffect(() => {
        if (!isPlaying || !homeTeam || !awayTeam) return;

        if (minute >= 90) {
            setIsPlaying(false);
            const endEvent = '=== SPIELENDE ===';
            setEvents((prev) => [...prev, endEvent]);
            setLastEvent(endEvent);
            return;
        }

        if (minute % 10 === 0 && Math.random() < 0.1) {
            const scorer = Math.random() > 0.5 ? homeTeam : awayTeam;
            const updated = { ...scorer, goals: scorer.goals + 1 };
            scorer === homeTeam ? setHomeTeam(updated) : setAwayTeam(updated);
            const event = `${minute}' - TOOOOR für ${scorer.name}`;
            setEvents((prev) => [...prev, event]);
            setLastEvent(event);
        }
    }, [minute]);

    useEffect(() => {
        if (eventLogRef.current) {
            eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
        }
    }, [events]);

    return (
        <div className="simulation-container">
            <h1 className="league-title">BUNDESLIGA</h1>

            <div className="match-header">
                <div className="team home-team">
                    {homeTeam?.logo && <img src={homeTeam?.logo} alt="Home Logo" className="team-logo" />}


                    <h2>{homeTeam?.name}</h2>
                </div>

                <div className="match-score">
                    <div className="score-display">
                        <span className="goals">{homeTeam?.goals ?? 0}</span>
                        <span className="divider">-</span>
                        <span className="goals">{awayTeam?.goals ?? 0}</span>
                    </div>
                    <div className="match-minute">{minute}'</div>
                </div>

                <div className="team away-team">
                    {awayTeam?.logo && <img src={awayTeam?.logo} alt="Away Logo" className="team-logo" />}
                    <h2>{awayTeam?.name}</h2>
                </div>
            </div>

            <div className="control-panel">
                <button className="start-button" onClick={startSimulation}>Spiel starten</button>
            </div>

            <div className="match-container">
                {/* Home Team (left side) */}
                <div className="team-sheet home-team">
                    <h3>Aufstellung</h3>
                    <table className="players-table">
                        <thead>
                        <tr><th>#</th><th>Name</th><th>Pos</th><th>Rating</th></tr>
                        </thead>
                        <tbody>
                        {homeTeam?.players.map((player, index) => (
                            <tr key={index}>
                                <td>{player.number}</td>
                                <td>{player.firstname} {player.lastname}</td>
                                <td>{player.position}</td>
                                <td>{player.rating}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Match Events */}
                <div className="match-events">
                    <div className="current-event">{lastEvent || 'Spiel läuft...'}</div>
                    <div className="event-log" ref={eventLogRef}>
                        <h3>Spielverlauf</h3>
                        <div className="events-list">
                            {events.map((event, index) => (
                                <div key={index} className="event-item">{event}</div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Away Team (right side) */}
                <div className="team-sheet away-team">
                    <h3>Aufstellung</h3>
                    <table className="players-table">
                        <thead>
                        <tr><th>#</th><th>Name</th><th>Pos</th><th>Rating</th></tr>
                        </thead>
                        <tbody>
                        {awayTeam?.players.map((player, index) => (
                            <tr key={index}>
                                <td>{player.number}</td>
                                <td>{player.firstname} {player.lastname}</td>
                                <td>{player.position}</td>
                                <td>{player.rating}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Simulation;
