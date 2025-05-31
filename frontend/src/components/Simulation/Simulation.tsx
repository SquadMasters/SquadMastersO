import React, {useEffect, useState, useCallback} from "react";
import {parse, format} from "date-fns";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import api from "../../api";
import "./Simulation.css";

// Vereinslogos
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

const logoMap: Record<string, string> = {
    Arsenal: arsenal,
    "Atlético Madrid": atletico,
    "FC Barcelona": barca,
    "Bayern München": bayern,
    "Manchester City": city,
    "Inter Mailand": inter,
    "Juventus Turin": juve,
    Liverpool: liverpool,
    "AC Mailand": milan,
    "Paris Saint-Germain": psg,
    "Real Madrid": real,
};

interface Spiel {
    homeTeam: string;
    awayTeam: string;
    date: Date;
    homeGoals: number | null;
    awayGoals: number | null;
}

interface SimulationUpdate {
    type: string;
    data: any;
}

const Simulation: React.FC = () => {
    const [spiele, setSpiele] = useState<Spiel[]>([]);

    const [halbjahr, setHalbjahr] = useState<"H1" | "H2">("H1");
    const [isTransferWindow, setIsTransferWindow] = useState(false);
    const [isSimulationActive, setIsSimulationActive] = useState(false);
    const [isUserReady, setIsUserReady] = useState(false);
    const [notReadyUsers, setNotReadyUsers] = useState<string[]>([]);
    const [isEndingSeason, setIsEndingSeason] = useState(false);
    const [isFirstHalfSimulated, setIsFirstHalfSimulated] = useState(false);
    const [isSecondHalfSimulated, setIsSecondHalfSimulated] = useState(false);
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const username = localStorage.getItem("username") || "";
    const careername = localStorage.getItem("careername") || "";
    const clubname = localStorage.getItem("clubname") || "";
    const [eigenerVerein, setEigenerVerein] = useState(clubname || "");

    const isCurrentHalfSimulated = halbjahr === "H1" ? isFirstHalfSimulated : isSecondHalfSimulated;
    const allUsersReady = notReadyUsers.length === 0;

    const setupWebSocket = useCallback(() => {
        const socket = new SockJS("http://localhost:8080/ws-simulation");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        });

        client.onConnect = () => {
            client.subscribe(
                `/topic/simulation-updates/${careername}`,
                (message) => {
                    const update: SimulationUpdate = JSON.parse(message.body);
                    handleWebSocketUpdate(update);
                }
            );
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client.connected) {
                client.deactivate();
            }
        };
    }, [careername]);

    const checkAdminStatus = useCallback(async () => {
        try {
            const res = await api.get(`/simulation/isAllowedToSimulate`, {
                params: { username, careername }
            });
            setIsAdmin(res.data);
        } catch (err) {
            console.error("Fehler beim Überprüfen des Admin-Status", err);
        }
    }, [username, careername]);

    const loadNotReadyUsers = useCallback(async () => {
        try {
            const res = await api.get(`/simulation/notReadyUsers`, {
                params: { careername }
            });
            setNotReadyUsers(res.data);
        } catch (err) {
            console.error("Fehler beim Laden der nicht bereiten Benutzer", err);
        }
    }, [careername]);

    const loadUserReadyStatus = useCallback(async () => {
        try {
            const res = await api.get(`/simulation/isUserReady`, {
                params: { username, careername }
            });
            setIsUserReady(res.data);
        } catch (err) {
            console.error("Fehler beim Laden des Bereitstatus", err);
        }
    }, [username, careername]);

    const loadGames = async () => {
        try {
            const res = await api.get(`/games/allNextGames/${username}/${careername}`);
            const parsed = res.data.map((spiel: any) => ({
                ...spiel,
                date: parse(spiel.date, "dd.MM.yyyy", new Date()),
            }));
            setSpiele(parsed);

            // Überprüfe Hinrunde
            const firstHalfGames = parsed.filter((game: Spiel) =>
                game.date.getMonth() >= 6
            );
            const allFirstHalfPlayed = firstHalfGames.every(
                (game: Spiel) => game.homeGoals !== null && game.awayGoals !== null
            );
            setIsFirstHalfSimulated(allFirstHalfPlayed);

            // Überprüfe Rückrunde
            const secondHalfGames = parsed.filter((game: Spiel) =>
                game.date.getMonth() < 6
            );
            const allSecondHalfPlayed = secondHalfGames.every(
                (game: Spiel) => game.homeGoals !== null && game.awayGoals !== null
            );
            setIsSecondHalfSimulated(allSecondHalfPlayed);
        } catch (err) {
            console.error("Fehler beim Laden der Spiele", err);
        }
    };

    const handleWebSocketUpdate = useCallback((update: SimulationUpdate) => {
        console.log("WebSocket Update:", update);
        switch (update.type) {
            case "USER_READY":
                setNotReadyUsers(prev => prev.filter(u => u !== update.data));
                setStatusMessage(`Benutzer ${update.data} ist bereit`);
                setTimeout(() => setStatusMessage(""), 3000);
                break;
            case "SIMULATION_STARTED":
                setStatusMessage(`Simulation der ${update.data ? "Hinrunde" : "Rückrunde"} gestartet`);
                setTimeout(() => setStatusMessage(""), 3000);
                loadGames();
                if (update.data) { // firstHalf is true
                    setHalbjahr("H2");
                    setIsTransferWindow(false);
                }
                loadNotReadyUsers();
                loadUserReadyStatus();
                break;
            case "SEASON_ENDED":
                setStatusMessage("Saison erfolgreich beendet");
                setTimeout(() => setStatusMessage(""), 3000);
                loadGames();
                setHalbjahr("H1");
                setIsTransferWindow(true);
                setIsFirstHalfSimulated(false);
                setIsSecondHalfSimulated(false);
                loadNotReadyUsers();
                loadUserReadyStatus();
                break;
            default:
                console.warn("Unbekannter Update-Typ:", update.type);
        }
    }, [loadGames, loadNotReadyUsers, loadUserReadyStatus]);

    useEffect(() => {
        if (!username || !careername) return;

        const loadInitialData = async () => {
            await checkAdminStatus();
            await loadGames();
            await loadNotReadyUsers();
            await loadUserReadyStatus();

            const savedTransferWindow = localStorage.getItem("transferWindow");
            setIsTransferWindow(savedTransferWindow === "open");

            setupWebSocket();
        };

        loadInitialData();

        return () => {
            if (stompClient) {
                stompClient.deactivate();
            }
        };
    }, [username, careername, clubname, setupWebSocket, stompClient, checkAdminStatus]);

    useEffect(() => {
        console.log('Aktuelle Spiele:', spiele);
        console.log('Eigener Verein:', eigenerVerein);
    }, [spiele, eigenerVerein]);

    const starteSimulation = async () => {
        if (!allUsersReady || isCurrentHalfSimulated) return;

        setIsSimulationActive(true);
        try {
            await api.post(`/simulation/start`, null, {
                params: { careername, firstHalf: halbjahr === "H1" },
            });

            if (halbjahr === "H1") {
                setIsTransferWindow(false);
                localStorage.setItem("transferWindow", "closed");
            }

            await loadGames();
        } catch (err: any) {
            console.error("Fehler bei Simulation", err);
            setStatusMessage(err.response?.data || "Fehler bei der Simulation");
            setTimeout(() => setStatusMessage(""), 3000);
        } finally {
            setIsSimulationActive(false);
        }
    };

    const beendeSaison = async () => {
        if (!allUsersReady || !isSecondHalfSimulated) return;

        setIsEndingSeason(true);
        try {
            await api.post(`/simulation/endSeason`, null, {
                params: { careername }
            });

            setIsTransferWindow(true);
            localStorage.setItem("transferWindow", "open");
            await loadGames();
        } catch (err) {
            console.error("Fehler beim Beenden der Saison", err);
            setStatusMessage(err.response?.data || "Fehler beim Beenden der Saison");
            setTimeout(() => setStatusMessage(""), 3000);
        } finally {
            setIsEndingSeason(false);
        }
    };

    const handleReady = async () => {
        try {
            setIsSimulationActive(true);
            await api.patch(`/simulation/pressReady`, null, {
                params: {
                    username,
                    careername
                }
            });

            setIsUserReady(true);
            setStatusMessage("Bereit gemeldet");
            setTimeout(() => setStatusMessage(""), 3000);
        } catch (err) {
            console.error("Fehler beim Bereitmelden", err);
            setStatusMessage(err.response?.data || "Fehler beim Bereitmelden");
            setTimeout(() => setStatusMessage(""), 3000);
        } finally {
            setIsSimulationActive(false);
        }
    };

    const getMatchColorClass = useCallback((spiel: Spiel): string => {
        console.log('Checking match color for:', spiel);
        console.log('Eigener Verein:', eigenerVerein);

        if (!eigenerVerein) {
            console.log('No team selected');
            return "";
        }

        if (spiel.homeGoals === null || spiel.awayGoals === null) {
            console.log('No scores yet');
            return "";
        }

        const isHomeGame = spiel.homeTeam === eigenerVerein;
        const isAwayGame = spiel.awayTeam === eigenerVerein;

        if (!isHomeGame && !isAwayGame) {
            console.log('Not our team playing');
            return "";
        }

        const myGoals = isHomeGame ? spiel.homeGoals : spiel.awayGoals;
        const oppGoals = isHomeGame ? spiel.awayGoals : spiel.homeGoals;

        console.log(`Result: ${myGoals}-${oppGoals}`);

        if (myGoals > oppGoals) {
            console.log('Team win detected');
            return "team-win";
        }
        if (myGoals < oppGoals) {
            console.log('Team loss detected');
            return "team-loss";
        }
        console.log('Draw detected');
        return "team-draw";
    }, [eigenerVerein]);

    const getMatchCardClass = (spieleAnTag: Spiel[]): string => {
        if (!eigenerVerein) return "";

        const teamSpiel = spieleAnTag.find(s =>
            s.homeTeam === eigenerVerein || s.awayTeam === eigenerVerein
        );

        if (!teamSpiel || teamSpiel.homeGoals === null || teamSpiel.awayGoals === null) {
            return "";
        }

        const isHomeGame = teamSpiel.homeTeam === eigenerVerein;
        const myGoals = isHomeGame ? teamSpiel.homeGoals : teamSpiel.awayGoals;
        const oppGoals = isHomeGame ? teamSpiel.awayGoals : teamSpiel.homeGoals;

        if (myGoals > oppGoals) return "match-won";
        if (myGoals < oppGoals) return "match-lost";
        return "match-draw";
    };

    const tageMitSpielen = Array.from(
        new Set(
            spiele
                .filter((spiel) => {
                    const monat = spiel.date.getMonth();
                    return halbjahr === "H1" ? monat >= 6 : monat < 6;
                })
                .map((s) => s.date.toDateString())
        )
    )
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

    const spieleMitDatum = (tag: string) =>
        spiele.filter(
            (spiel) =>
                spiel.date.toDateString() === tag &&
                (halbjahr === "H1" ? spiel.date.getMonth() >= 6 : spiel.date.getMonth() < 6)
        );

    const getStatusMessage = () => {
        if (statusMessage) return statusMessage;
        if (notReadyUsers.length > 0) {
            return `Warten auf ${notReadyUsers.length} Benutzer: ${notReadyUsers.join(", ")}`;
        }
        if (isSecondHalfSimulated) {
            return "Alle bereit - Sie können die Saison jetzt beenden";
        }
        return "Alle bereit - Sie können die Simulation jetzt starten";
    };

    const handleHalbjahrChange = (newHalbjahr: "H1" | "H2") => {
        setHalbjahr(newHalbjahr);
        loadNotReadyUsers();
    };

    return (
        <div className="simulation">
            <div className="simulation-header">
                <div className="simulation-controls">
                    <button
                        onClick={() => handleHalbjahrChange("H1")}
                        className={halbjahr === "H1" ? "active" : ""}
                    >
                        Hinrunde
                    </button>
                    <button
                        onClick={() => handleHalbjahrChange("H2")}
                        className={halbjahr === "H2" ? "active" : ""}
                        disabled={!isFirstHalfSimulated}
                        title={!isFirstHalfSimulated ? "Zuerst Hinrunde simulieren" : ""}
                    >
                        Rückrunde
                    </button>

                    <button
                        onClick={handleReady}
                        disabled={isUserReady}
                        title={isUserReady ? "Bereits bereit gemeldet" : ""}
                    >
                        {isUserReady ? "Bereit ✓" : "Bereit melden"}
                    </button>
                </div>

                <div className={`status-message ${isAdmin ? "admin-message" : "user-message"}`}>
                    {getStatusMessage()}
                </div>

                <div className="user-status-overview">
                    <h4>Benutzerstatus:</h4>
                    <ul>
                        {notReadyUsers.map(user => (
                            <li key={user} className="not-ready-user">
                                {user} ⏳
                            </li>
                        ))}
                        {notReadyUsers.length === 0 && (
                            <li className="all-ready">Alle Benutzer bereit ✓</li>
                        )}
                    </ul>
                </div>

                {isAdmin && (
                    <div className="admin-controls">
                        <button
                            onClick={starteSimulation}
                            disabled={!allUsersReady || isCurrentHalfSimulated || isSimulationActive}
                            title={
                                !allUsersReady
                                    ? "Warten auf Benutzer"
                                    : isCurrentHalfSimulated
                                        ? "Bereits simuliert"
                                        : ""
                            }
                        >
                            {isSimulationActive ? "Simulation läuft..." : "Simulation starten"}
                        </button>

                        <button
                            onClick={beendeSaison}
                            disabled={!allUsersReady || !isSecondHalfSimulated || isEndingSeason}
                            title={
                                !isSecondHalfSimulated
                                    ? "Rückrunde zuerst simulieren"
                                    : !allUsersReady
                                        ? "Warten auf Benutzer"
                                        : ""
                            }
                        >
                            {isEndingSeason ? "Saison wird beendet..." : "Saison beenden"}
                        </button>
                    </div>
                )}
            </div>


            <div className="simulation-grid">
                {tageMitSpielen.map((tag, idx) => {
                    const tagString = tag.toDateString();
                    const spieleAnTag = spieleMitDatum(tagString);
                    const hasErgebnisse = spieleAnTag.every(
                        (spiel) => spiel.homeGoals !== null && spiel.awayGoals !== null
                    );

                    return (
                        <div
                            className={`simulation-cell ${getMatchCardClass(spieleAnTag)}`}
                            key={idx}
                        >
                            <div className="simulation-title">Spieltag</div>
                            <div className="simulation-date">{format(tag, "dd.MM")}</div>
                            {spieleAnTag.map((spiel, i) => {
                                const isUserGame = spiel.homeTeam === eigenerVerein || spiel.awayTeam === eigenerVerein;
                                const isHomeGame = spiel.homeTeam === eigenerVerein;

                                // Immer: Eigener Verein links, Gegner rechts
                                const leftTeam = isHomeGame ? spiel.homeTeam : spiel.awayTeam;
                                const rightTeam = isHomeGame ? spiel.awayTeam : spiel.homeTeam;
                                const leftLogo = logoMap[leftTeam];
                                const rightLogo = logoMap[rightTeam];

                                // Ergebnis immer aus eigener Perspektive anzeigen
                                const ergebnis = spiel.homeGoals !== null && spiel.awayGoals !== null
                                    ? isHomeGame
                                        ? `${spiel.homeGoals}:${spiel.awayGoals}`
                                        : `${spiel.awayGoals}:${spiel.homeGoals}`
                                    : "vs";

                                return (
                                    <div className={`simulation-match ${getMatchColorClass(spiel)}`} key={i}>
                                        <img src={leftLogo} alt={leftTeam}/>
                                        <span>{ergebnis}</span>
                                        <img src={rightLogo} alt={rightTeam}/>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="simulation-cell transferfenster-card">
                <div className="simulation-title">Transferfenster</div>
                <div className={`transferfenster-status ${isTransferWindow ? "open" : "closed"}`}>
                    {isTransferWindow ? "Geöffnet" : "Geschlossen"}
                </div>
            </div>
        </div>
    );
};

export default Simulation;