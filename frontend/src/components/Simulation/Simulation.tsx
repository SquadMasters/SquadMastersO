import React, {useEffect, useState, useCallback} from "react";
import {parse, format} from "date-fns";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";
import api from "../../api";
import "./Simulation.css";

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
import axios from "axios";

const logoMap: Record<string, string> = {
    "Arsenal": arsenal,
    "Atlético Madrid": atletico,
    "FC Barcelona": barca,
    "Bayern München": bayern,
    "Manchester City": city,
    "Inter Mailand": inter,
    "Juventus Turin": juve,
    "Liverpool": liverpool,
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
    type: "USER_READY" | "SIMULATION_STARTED" | "SEASON_ENDED";
    data: string | boolean;
}

interface ApiSpiel {
    homeTeam: string;
    awayTeam: string;
    date: string;
    homeGoals: number | null;
    awayGoals: number | null;
}

const Simulation: React.FC = () => {
    const [spiele, setSpiele] = useState<Spiel[]>([]);
    const [halbjahr, setHalbjahr] = useState<"H1" | "H2">("H1");
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
    const storedClub = localStorage.getItem("selectedTeam");
    const eigenerVereinName = storedClub ? JSON.parse(storedClub).name : "";
    const [eigenerVerein] = useState(eigenerVereinName);

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
            client.subscribe(`/topic/simulation-updates/${careername}`, (message: IMessage) => {
                const update: SimulationUpdate = JSON.parse(message.body);
                handleWebSocketUpdate(update);
            });
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client.connected) client.deactivate();
        };
    }, [careername]);

    const checkAdminStatus = useCallback(async () => {
        try {
            const res = await api.get<boolean>(`/simulation/isAllowedToSimulate`, {
                params: {username, careername},
            });
            setIsAdmin(res.data);
        } catch (err) {
            console.error("Fehler beim Überprüfen des Admin-Status", err);
        }
    }, [username, careername]);

    const loadNotReadyUsers = useCallback(async () => {
        try {
            const res = await api.get<string[]>(`/simulation/notReadyUsers`, {params: {careername}});
            setNotReadyUsers(res.data);
        } catch (err) {
            console.error("Fehler beim Laden der nicht bereiten Benutzer", err);
        }
    }, [careername]);

    const loadUserReadyStatus = useCallback(async () => {
        try {
            const res = await api.get<boolean>(`/simulation/isUserReady`, {params: {username, careername}});
            setIsUserReady(res.data);
        } catch (err) {
            console.error("Fehler beim Laden des Bereitstatus", err);
        }
    }, [username, careername]);

    const loadGames = async () => {
        try {
            const res = await api.get<ApiSpiel[]>(`/games/allNextGames/${username}/${careername}`);
            const parsed: Spiel[] = res.data.map((spiel) => ({
                ...spiel,
                date: parse(spiel.date, "dd.MM.yyyy", new Date()),
            }));
            setSpiele(parsed);

            const firstHalfGames = parsed.filter((g) => g.date.getMonth() >= 6);
            setIsFirstHalfSimulated(firstHalfGames.every((g) => g.homeGoals !== null && g.awayGoals !== null));

            const secondHalfGames = parsed.filter((g) => g.date.getMonth() < 6);
            setIsSecondHalfSimulated(secondHalfGames.every((g) => g.homeGoals !== null && g.awayGoals !== null));
        } catch (err) {
            console.error("Fehler beim Laden der Spiele", err);
        }
    };

    const handleWebSocketUpdate = useCallback((update: SimulationUpdate) => {
        switch (update.type) {
            case "USER_READY":
                setNotReadyUsers((prev) => prev.filter((u) => u !== update.data));
                setStatusMessage(`Benutzer ${update.data} ist bereit`);
                setTimeout(() => setStatusMessage(""), 3000);
                break;
            case "SIMULATION_STARTED":
                setStatusMessage(`Simulation der ${update.data ? "Hinrunde" : "Rückrunde"} gestartet`);
                setTimeout(() => setStatusMessage(""), 3000);
                loadGames();
                if (update.data) setHalbjahr("H2");
                loadNotReadyUsers();
                loadUserReadyStatus();
                break;
            case "SEASON_ENDED":
                setStatusMessage("Saison erfolgreich beendet");
                setTimeout(() => setStatusMessage(""), 3000);
                loadGames();
                setHalbjahr("H1");
                setIsFirstHalfSimulated(false);
                setIsSecondHalfSimulated(false);
                loadNotReadyUsers();
                loadUserReadyStatus();
                break;
        }
    }, [loadGames, loadNotReadyUsers, loadUserReadyStatus]);

    useEffect(() => {
        if (!username || !careername) return;

        const loadInitialData = async () => {
            await checkAdminStatus();
            await loadGames();
            await loadNotReadyUsers();
            await loadUserReadyStatus();
            setupWebSocket();
        };

        loadInitialData();
        return () => {
            if (stompClient) stompClient.deactivate();
        };
    }, [username, careername, setupWebSocket, stompClient, checkAdminStatus]);

    const getMatchCardClass = (spieleAnTag: Spiel[]): string => {
        const teamSpiel = spieleAnTag.find((s) => s.homeTeam === eigenerVerein || s.awayTeam === eigenerVerein);
        if (!teamSpiel || teamSpiel.homeGoals === null || teamSpiel.awayGoals === null) return "";
        const isHome = teamSpiel.homeTeam === eigenerVerein;
        const myGoals = isHome ? teamSpiel.homeGoals : teamSpiel.awayGoals;
        const oppGoals = isHome ? teamSpiel.awayGoals : teamSpiel.homeGoals;
        if (myGoals > oppGoals) return "match-won";
        if (myGoals < oppGoals) return "match-lost";
        return "match-draw";
    };

    const tageMitSpielen = Array.from(new Set(spiele.filter((s) => halbjahr === "H1" ? s.date.getMonth() >= 6 : s.date.getMonth() < 6).map((s) => s.date.toDateString())))
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

    const spieleMitDatum = (tag: string) => spiele.filter((s) => s.date.toDateString() === tag && (halbjahr === "H1" ? s.date.getMonth() >= 6 : s.date.getMonth() < 6));

    const getStatusMessage = () => {
        if (statusMessage) return statusMessage;
        if (notReadyUsers.length > 0) return `Warten auf ${notReadyUsers.length} Benutzer: ${notReadyUsers.join(", ")}`;
        if (isSecondHalfSimulated) return "Alle bereit - Sie können die Saison jetzt beenden";
        return "Alle bereit - Sie können die Simulation jetzt starten";
    };

    const handleHalbjahrChange = (newHalbjahr: "H1" | "H2") => {
        setHalbjahr(newHalbjahr);
        loadNotReadyUsers();
    };

    const starteSimulation = async () => {
        if (!allUsersReady || isCurrentHalfSimulated) return;
        setIsSimulationActive(true);
        try {
            await api.post(`/simulation/start`, null, {params: {careername, firstHalf: halbjahr === "H1"}});
            await loadGames();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setStatusMessage(err.response?.data || "Fehler bei der Simulation");
            } else {
                setStatusMessage("Fehler bei der Simulation");
            }
            setTimeout(() => setStatusMessage(""), 3000);
        } finally {
            setIsSimulationActive(false);
        }
    };

    const beendeSaison = async () => {
        if (!allUsersReady || !isSecondHalfSimulated) return;
        setIsEndingSeason(true);
        try {
            await api.post(`/simulation/endSeason`, null, {params: {careername}});
            await loadGames();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setStatusMessage(err.response?.data || "Fehler beim Beenden der Saison");
            } else {
                setStatusMessage("Fehler beim Beenden der Saison");
            }
            setTimeout(() => setStatusMessage(""), 3000);
        } finally {
            setIsEndingSeason(false);
        }
    };

    const handleReady = async () => {
        try {
            setIsSimulationActive(true);
            await api.patch(`/simulation/pressReady`, null, {params: {username, careername}});
            setIsUserReady(true);
            setStatusMessage("Bereit gemeldet");
            setTimeout(() => setStatusMessage(""), 3000);
        } catch (err: any) {
            let message = "Unexpected error";

            if (
                err.response?.status === 400 &&
                typeof err.response?.data === 'string' &&
                err.response.data.includes("Not enough players in the starting lineup")
            ) {
                message = "Simulieren nur bei voller Startelf möglich!";
            }

            console.error("Fehler beim Bereitmelden:", message);
            setStatusMessage(message);
            setTimeout(() => setStatusMessage(""), 3000);
        } finally {
            setIsSimulationActive(false);
        }
    };

    return (
        <div className="simulation">
            <div className="simulation-header">
                <div className="simulation-controls">
                    <button onClick={() => handleHalbjahrChange("H1")}
                            className={halbjahr === "H1" ? "active" : ""}>Hinrunde
                    </button>
                    <button onClick={() => handleHalbjahrChange("H2")} className={halbjahr === "H2" ? "active" : ""}
                            disabled={!isFirstHalfSimulated}>Rückrunde
                    </button>
                    <button onClick={handleReady}
                            disabled={isUserReady}>{isUserReady ? "Bereit ✓" : "Bereit melden"}</button>
                </div>
                <div
                    className={`status-message ${isAdmin ? "admin-message" : "user-message"}`}>{getStatusMessage()}</div>
                <div className="user-status-overview">
                    <h4>Benutzerstatus:</h4>
                    <ul>
                        {notReadyUsers.map((user) => <li key={user}>{user} ⏳</li>)}
                        {notReadyUsers.length === 0 && <li>Alle Benutzer bereit ✓</li>}
                    </ul>
                </div>
                {isAdmin && (
                    <div className="admin-controls">
                        <button onClick={starteSimulation}
                                disabled={!allUsersReady || isCurrentHalfSimulated || isSimulationActive}>{isSimulationActive ? "Simulation läuft..." : "Simulation starten"}</button>
                        <button onClick={beendeSaison}
                                disabled={!allUsersReady || !isSecondHalfSimulated || isEndingSeason}>{isEndingSeason ? "Saison wird beendet..." : "Saison beenden"}</button>
                    </div>
                )}
            </div>
            <div className="simulation-grid">
                {tageMitSpielen.map((tag) => {
                    const tagString = tag.toDateString();
                    const spieleAnTag = spieleMitDatum(tagString);
                    const klasse = getMatchCardClass(spieleAnTag);
                    return (
                        <div className={`simulation-cell ${klasse}`} key={tagString}>
                            <div className="simulation-title">Spieltag</div>
                            <div className={`simulation-date ${klasse}`}>{format(tag, "dd.MM")}</div>
                            {spieleAnTag.map((spiel, i) => {
                                const isHomeGame = spiel.homeTeam === eigenerVerein;
                                const leftTeam = isHomeGame ? spiel.homeTeam : spiel.awayTeam;
                                const rightTeam = isHomeGame ? spiel.awayTeam : spiel.homeTeam;
                                const ergebnis =
                                    spiel.homeGoals !== null && spiel.awayGoals !== null
                                        ? isHomeGame
                                            ? `${spiel.homeGoals}:${spiel.awayGoals}`
                                            : `${spiel.awayGoals}:${spiel.homeGoals}`
                                        : "vs";
                                return (
                                    <div className="simulation-match" key={i}>
                                        <img src={logoMap[leftTeam]} alt={leftTeam}/>
                                        <span>{ergebnis}</span>
                                        <img src={logoMap[rightTeam]} alt={rightTeam}/>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Simulation;
