import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import "./TeamBuild.css";
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

const TeamBuild = () => {
    const savedTeam = localStorage.getItem("selectedTeam");
    const parsedTeam = savedTeam ? JSON.parse(savedTeam) : null;
    const clubName = parsedTeam?.name || "Unbekanntes Team";
    const clubLogo = logoMap[parsedTeam?.name] || "/default-logo.png";

    const username = localStorage.getItem("username") || "";
    const careername = localStorage.getItem("careername") || "";

    const fieldPositions = ["LAV", "IV1", "IV2", "RAV", "ZM1", "DZM", "ZM2", "LF", "ST", "RF", "TW"];
    const [players, setPlayers] = useState<any[]>([]);
    const [field, setField] = useState<Record<string, any>>({});
    const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
    const [assignedPlayers, setAssignedPlayers] = useState<Set<string>>(new Set());
    const [selectedPosition, setSelectedPosition] = useState("Alle");


    useEffect(() => {
        const url = `http://localhost:8080/trainerCareerPlayer/allPlayersFromTrainerCareer?username=${encodeURIComponent(username)}&careername=${encodeURIComponent(careername)}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Fehler: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                const withShorts = data.map((p: any) => ({
                    ...p,
                    short: getInitials(p.firstname, p.lastname),
                    age: p.ageNow,
                    value: `€${(p.value / 1_000_000).toFixed(1)}M`,
                }));
                setPlayers(withShorts);
                const initialField: Record<string, any> = {};
                fieldPositions.forEach(pos => initialField[pos] = null);
                setField(initialField);
            })
            .catch((err) => {
                console.error("Fehler beim Laden der Spieler:", err);
            });
    }, [username, careername]);

    const getInitials = (first: string, last: string) => {
        return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
    };

    const handleDragStart = (event: React.DragEvent, player: any) => {
        event.dataTransfer.setData("player", JSON.stringify(player));
    };

    const handleDrop = (event: React.DragEvent, position: string) => {
        event.preventDefault();
        const droppedPlayer = JSON.parse(event.dataTransfer.getData("player"));

        const validPositions: { [key: string]: string[] } = {
            TW: ["TW"],
            IV: ["IV1", "IV2"],
            LV: ["LAV"],
            RV: ["RAV"],
            ZM: ["ZM1", "ZM2", "DZM","ZDM"],
            DZM: ["DZM", "ZM1", "ZM2","ZDM"],
            OM: ["ZM1", "ZM2", "DZM"],
            ST: ["ST"],
            LF: ["LF"],
            RF: ["RF"],
        };

        const allowedPositions = validPositions[droppedPlayer.position] || [];
        if (!allowedPositions.includes(position)) return;

        setField(prev => {
            const newField = { ...prev };
            const oldPlayer = newField[position];
            newField[position] = droppedPlayer;

            // Wenn Spieler ersetzt wurde, entferne alten aus "assigned"
            setAssignedPlayers(prevAssigned => {
                const updated = new Set(prevAssigned);
                updated.add(droppedPlayer.short);
                if (oldPlayer) updated.delete(oldPlayer.short);
                return updated;
            });

            return newField;
        });

        setHighlighted(prev => ({ ...prev, [position]: true }));
        setTimeout(() => {
            setHighlighted(prev => ({ ...prev, [position]: false }));
        }, 1000);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const getSelectedPlayerCount = () => {
        return Object.values(field).filter(p => p !== null).length;
    };

    const getTotalRating = () => {
        return Object.values(field).reduce((sum, p) => sum + (p?.rating || 0), 0);
    };

    const getTotalValue = () => {
        const total = Object.values(field).reduce((sum, p) => {
            if (!p?.value) return sum;
            const num = parseFloat(p.value.replace(/[^0-9.]/g, ""));
            return sum + num;
        }, 0);
        return `€${total.toFixed(1)}M`;
    };

    const generateRandomLineup = () => {
        const shuffled = [...players].sort(() => Math.random() - 0.5);
        const newField: Record<string, any> = {};
        const usedShorts = new Set<string>();

        fieldPositions.forEach(pos => {
            const match = shuffled.find(p => {
                const validPositions: { [key: string]: string[] } = {
                    TW: ["TW"],
                    IV: ["IV1", "IV2"],
                    LV: ["LAV"],
                    RV: ["RAV"],
                    ZM: ["ZM1", "ZM2", "DZM","ZDM"],
                    DZM: ["DZM", "ZM1", "ZM2","ZDM"],
                    OM: ["ZM1", "ZM2", "DZM"],
                    ST: ["ST"],
                    LF: ["LF"],
                    RF: ["RF"],
                };
                return !usedShorts.has(p.short) &&
                    (validPositions[p.position]?.includes(pos) ?? false);
            });

            newField[pos] = match || null;
            if (match) usedShorts.add(match.short);
        });

        setField(newField);
        setAssignedPlayers(usedShorts);
    };

    return (
        <div className="teambuild-container">
            <h1 className="teambuild-title">TeamBuild</h1>
            <div className="club-header">
                <img src={clubLogo} alt={clubName} className="club-logo" />
                <h2>{clubName}</h2>
            </div>

            <div className="team-info">
                <p>Spieler: <strong>{getSelectedPlayerCount()}</strong> / {fieldPositions.length}</p>
                <p>Gesamt-Rating: <strong>{getTotalRating()}</strong></p>
                <p>Gesamt-Marktwert: <strong>{getTotalValue()}</strong></p>
                <Button variant="primary" onClick={generateRandomLineup}>Zufällige Aufstellung</Button>
            </div>

            <div className="teambuild-content">
                <div className="team-field-container">
                    <div className="team-field">
                        <div className="field-lines">
                            <div className="half-line"></div>
                            <div className="center-circle"></div>
                            <div className="goal-area top"></div>
                            <div className="goal-area bottom"></div>
                            <div className="penalty-box top"></div>
                            <div className="penalty-box bottom"></div>
                        </div>

                        {Object.keys(field).map((position, index) => {
                            const player = field[position];
                            return (
                                <div
                                    key={index}
                                    className={`player ${position} ${highlighted[position] ? "highlight" : ""} ${player ? "occupied" : ""}`}
                                    onDrop={(event) => handleDrop(event, position)}
                                    onDragOver={handleDragOver}
                                    title={player ? `${player.firstname} ${player.lastname}` : position}
                                >
                                    {player ? player.short : position}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="player-list">
                    <h2>Spielerliste</h2>
                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ marginRight: "10px" }}>Position filtern:</label>
                        <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
                            <option value="Alle">Alle</option>
                            <option value="TW">TW</option>
                            <option value="LV">LV</option>
                            <option value="RV">RV</option>
                            <option value="IV">IV</option>
                            <option value="ZM">ZM</option>
                            <option value="DZM">DZM</option>
                            <option value="OM">OM</option>
                            <option value="LF">LF</option>
                            <option value="RF">RF</option>
                            <option value="ST">ST</option>
                        </select>
                    </div>

                    <Table>
                        <thead>
                        <tr>
                            <th>Rating</th>
                            <th>Short</th>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Position</th>
                            <th>Alter</th>
                            <th>Wert</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players
                            .filter(p => selectedPosition === "Alle" || p.position === selectedPosition)
                            .map((p, idx) => {
                                const isAssigned = assignedPlayers.has(p.short);

                                return (
                                    <tr
                                        key={idx}
                                        className={isAssigned ? "assigned-row" : ""}
                                        draggable={!isAssigned}
                                        onDragStart={(event) => !isAssigned && handleDragStart(event, p)}
                                        style={{
                                            opacity: isAssigned ? 0.5 : 1,
                                            cursor: isAssigned ? "not-allowed" : "grab",
                                        }}
                                    >


                                    <td>{p.rating}</td>
                                        <td>{p.short}</td>
                                        <td>{p.firstname}</td>
                                        <td>{p.lastname}</td>
                                        <td>{p.position}</td>
                                        <td>{p.age}</td>
                                        <td>{p.value}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default TeamBuild;
