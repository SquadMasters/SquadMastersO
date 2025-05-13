import React, { useEffect, useState } from "react";
import { parse, format } from "date-fns";
import api from "../../api";
import "./Simulation.css";

// Team logos
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
}

interface Ergebnis {
    homeGoals: number;
    awayGoals: number;
}

type ErgebnisseMap = {
    [key: string]: Ergebnis;
};

const Simulation: React.FC = () => {
    const [spiele, setSpiele] = useState<Spiel[]>([]);
    const [eigenerVerein, setEigenerVerein] = useState("");
    const [halbjahr, setHalbjahr] = useState<"H1" | "H2">("H1");
    const [currentSimDay, setCurrentSimDay] = useState<string | null>(null);
    const [simulierteTage, setSimulierteTage] = useState<string[]>([]);
    const [ergebnisse, setErgebnisse] = useState<ErgebnisseMap>({});
    const [isTransferWindow, setIsTransferWindow] = useState(false);
    const [isSimulationActive, setIsSimulationActive] = useState(false);
    const [hinrundeCompleted, setHinrundeCompleted] = useState(false);
    const [rueckrundeCompleted, setRueckrundeCompleted] = useState(false);

    useEffect(() => {
        const username = localStorage.getItem("username") || "";
        const careername = localStorage.getItem("careername") || "";
        const clubname = localStorage.getItem("clubname") || "";

        if (!username || !careername) return;
        setEigenerVerein(clubname);

        api
            .get(`/games/allNextGames/${username}/${careername}`)
            .then((res) => {
                const parsed = res.data.map((spiel: any) => ({
                    ...spiel,
                    date: parse(spiel.date, "dd.MM.yyyy", new Date()),
                }));
                setSpiele(parsed);
            })
            .catch((err) => console.error("Fehler beim Laden der Spiele", err));

        // Load existing results from localStorage
        const savedResults = localStorage.getItem("simulationResults");
        if (savedResults) {
            setErgebnisse(JSON.parse(savedResults));
        }

        const savedHinrunde = localStorage.getItem("hinrundeCompleted");
        if (savedHinrunde) setHinrundeCompleted(savedHinrunde === "true");

        const savedRueckrunde = localStorage.getItem("rueckrundeCompleted");
        if (savedRueckrunde) setRueckrundeCompleted(savedRueckrunde === "true");

        // Load transfer window status from LocalStorage
        const savedTransferWindow = localStorage.getItem("transferWindow");
        if (savedTransferWindow) {
            setIsTransferWindow(savedTransferWindow === "open");
        }

    }, []);

    const starteSimulation = () => {
        if (tageMitSpielen.length === 0) return;

        setIsSimulationActive(true);
        localStorage.setItem("simulationStatus", "active");

        let index = 0;
        setSimulierteTage([]);
        setCurrentSimDay(tageMitSpielen[0].toDateString());
        localStorage.setItem("transferWindow", "closed"); // Default to closed for Rückrunde

        const interval = setInterval(() => {
            const aktuellerTag = tageMitSpielen[index];

            const neueErgebnisse: ErgebnisseMap = {};
            spiele.forEach((spiel) => {
                if (spiel.date.toDateString() === aktuellerTag.toDateString()) {
                    const key = `${spiel.date.toDateString()}-${spiel.homeTeam}-${spiel.awayTeam}`;
                    neueErgebnisse[key] = {
                        homeGoals: Math.floor(Math.random() * 5),
                        awayGoals: Math.floor(Math.random() * 5),
                    };
                }
            });

            setErgebnisse((prev) => {
                const updated = { ...prev, ...neueErgebnisse };
                localStorage.setItem("simulationResults", JSON.stringify(updated));
                return updated;
            });

            setSimulierteTage((prev) => [...prev, aktuellerTag.toDateString()]);
            index++;

            if (index < tageMitSpielen.length) {
                setCurrentSimDay(tageMitSpielen[index].toDateString());
            } else {
                clearInterval(interval);
                setCurrentSimDay(null);

                if (halbjahr === "H1") {
                    setHinrundeCompleted(true);
                    setIsTransferWindow(true); // Keep Transfer Window open for Hinrunde
                    localStorage.setItem("hinrundeCompleted", "true");
                    localStorage.setItem("transferWindow", "open");
                } else {
                    setRueckrundeCompleted(true);
                    setIsTransferWindow(false); // Close Transfer Window for Rückrunde
                    localStorage.setItem("rueckrundeCompleted", "true");
                    localStorage.setItem("transferWindow", "closed");

                    // Clear results only when Rückrunde is completed
                    localStorage.removeItem("simulationResults");
                    localStorage.removeItem("hinrundeCompleted");
                    localStorage.removeItem("rueckrundeCompleted");
                }

                setIsSimulationActive(false);
                localStorage.setItem("simulationStatus", "inactive");
            }
        }, 800);
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

    const showResults = (tagString: string) => {
        if (halbjahr === "H1") {
            return hinrundeCompleted || simulierteTage.includes(tagString);
        } else {
            return rueckrundeCompleted || simulierteTage.includes(tagString);
        }
    };

    return (
        <div className="simulation">
            <div className="simulation-controls">
                <button
                    onClick={() => {
                        setHalbjahr("H1");
                        setIsTransferWindow(true); // Open Transfer Window when switching to Hinrunde
                        localStorage.setItem("transferWindow", "open"); // Save state in LocalStorage
                    }}
                    disabled={halbjahr === "H1" || isSimulationActive}
                >
                    Hinrunde (Jul–Dez)
                </button>
                <button
                    onClick={() => {
                        setHalbjahr("H2");
                        setIsTransferWindow(false); // Close Transfer Window when switching to Rückrunde
                        localStorage.setItem("transferWindow", "closed"); // Save state in LocalStorage
                    }}
                    disabled={halbjahr === "H2" || isSimulationActive}
                >
                    Rückrunde (Jan–Jun)
                </button>
                <button
                    onClick={starteSimulation}
                    className="simulation-start"
                    disabled={isSimulationActive}
                >
                    {isSimulationActive ? "Simulation läuft..." : "Start Simulation"}
                </button>
            </div>

            <div className="simulation-grid">
                {tageMitSpielen.map((tag, idx) => {
                    const tagString = tag.toDateString();
                    const spieleAnTag = spiele.filter((spiel) => {
                        const monat = spiel.date.getMonth();
                        const imHalbjahr = halbjahr === "H1" ? monat >= 6 : monat < 6;
                        return imHalbjahr && spiel.date.toDateString() === tagString;
                    });

                    const shouldShowResults = showResults(tagString);
                    const isCurrent = currentSimDay === tagString;

                    return (
                        <div
                            className={`simulation-cell ${shouldShowResults ? "simulation-simulated" : ""} ${isCurrent ? "simulation-current" : ""}`}
                            key={idx}
                        >
                            <div className="simulation-title">Spieltag</div>
                            <div className="simulation-date">{format(tag, "dd.MM")}</div>
                            {spieleAnTag.map((spiel, i) => {
                                const istHeim = spiel.homeTeam === eigenerVerein;
                                const teamLinks = istHeim ? spiel.homeTeam : spiel.awayTeam;
                                const teamRechts = istHeim ? spiel.awayTeam : spiel.homeTeam;

                                const key = `${spiel.date.toDateString()}-${spiel.homeTeam}-${spiel.awayTeam}`;
                                const ergebnis = ergebnisse[key]
                                    ? `${ergebnisse[key].homeGoals}:${ergebnisse[key].awayGoals}`
                                    : "vs";

                                return (
                                    <div className="simulation-match" key={i}>
                                        <img src={logoMap[teamLinks]} alt={teamLinks} />
                                        <span>{shouldShowResults ? ergebnis : "vs"}</span>
                                        <img src={logoMap[teamRechts]} alt={teamRechts} />
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
                {hinrundeCompleted && halbjahr === "H1" && (
                    <div className="hinrunde-completed-message">
                        Hinrunde abgeschlossen! Transferfenster geöffnet!
                    </div>
                )}
                {rueckrundeCompleted && halbjahr === "H2" && (
                    <div className="rueckrunde-completed-message">
                        Saison abgeschlossen! Alle Ergebnisse verfügbar!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Simulation;
