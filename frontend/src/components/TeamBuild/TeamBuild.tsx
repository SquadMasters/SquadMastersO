import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "./TeamBuild.css";

const TeamBuild = () => {
    const savedTeam = localStorage.getItem("selectedTeam");
    const parsedTeam = savedTeam ? JSON.parse(savedTeam) : null;
    const clubName = parsedTeam?.name || "Unbekanntes Team";
    const clubLogo = parsedTeam?.logo || "/default-logo.png";

    const username = localStorage.getItem("username") || "";
    const careername = localStorage.getItem("careername") || "";

    const fieldPositions = ["LAV", "IV1", "IV2", "RAV", "ZM1", "DZM", "ZM2", "LF", "ST", "RF", "TW"];
    const [players, setPlayers] = useState<any[]>([]);
    const [field, setField] = useState(fieldPositions.reduce((acc, pos) => ({ ...acc, [pos]: null }), {}));
    const [highlighted, setHighlighted] = useState<{ [key: string]: boolean }>({});
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
                console.log("Empfangene Spieler:", data);
                const withShorts = data.map((p: any) => ({
                    ...p,
                    short: getInitials(p.firstname, p.lastname),
                    age: p.ageNow,
                    value: `€${(p.value / 1_000_000).toFixed(1)}M`,
                }));
                setPlayers(withShorts);
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
        const player = JSON.parse(event.dataTransfer.getData("player"));

        const validPositions: { [key: string]: string[] } = {
            TW: ["TW"],
            IV: ["IV1", "IV2"],
            LV: ["LAV"],
            RV: ["RAV"],
            ZM: ["ZM1", "ZM2", "DZM"],
            DZM: ["DZM", "ZM1", "ZM2"],
            OM: ["ZM1", "ZM2", "DZM"],
            ST: ["ST"],
            LF: ["LF"],
            RF: ["RF"],
        };

        const allowedPositions = validPositions[player.position] || [];

        if (!allowedPositions.includes(position)) return;
        if (Object.values(field).includes(player)) return;

        setField(prev => ({ ...prev, [position]: player }));
        setAssignedPlayers(prev => new Set(prev).add(player.short));

        setHighlighted(prev => ({ ...prev, [position]: true }));
        setTimeout(() => {
            setHighlighted(prev => ({ ...prev, [position]: false }));
        }, 1000);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const getSelectedPlayerCount = () => {
        return Object.values(field).filter(player => player !== null).length;
    };

    const getTotalRating = () => {
        return Object.values(field)
            .filter(player => player !== null)
            .reduce((sum, player) => sum + (player?.rating || 0), 0);
    };

    const getTotalValue = () => {
        const total = Object.values(field)
            .filter(player => player !== null)
            .reduce((sum, player) => {
                if (!player?.value) return sum;
                const num = parseFloat(player.value.replace(/[^0-9.]/g, ""));
                return sum + num;
            }, 0);
        return `€${total.toFixed(1)}M`;
    };

    return (
        <div className="teambuild-container">
            <h1 className="teambuild-title">TeamBuild</h1>

            {/* Clubanzeige */}
            <div className="club-header">
                <img src={clubLogo} alt={clubName} className="club-logo" />
                <h2>{clubName}</h2>
            </div>

            {/* Infos */}
            <div className="team-info">
                <p>Spieler: <strong>{getSelectedPlayerCount()}</strong> / {fieldPositions.length}</p>
                <p>Gesamt-Rating: <strong>{getTotalRating()}</strong></p>
                <p>Gesamt-Marktwert: <strong>{getTotalValue()}</strong></p>
            </div>

            <div className="teambuild-content">
                {/* Spielfeld */}
                <div className="team-field-container">
                    <div className="team-field">
                        <div className="field-lines">
                            <div className="goal-area top"></div>
                            <div className="center-circle"></div>
                            <div className="goal-area bottom"></div>
                        </div>

                        {Object.keys(field).map((position, index) => (
                            <div
                                key={index}
                                className={`player ${position} 
                                    ${highlighted[position] ? "highlight" : ""} 
                                    ${field[position] ? "occupied" : ""}`}
                                onDrop={(event) => handleDrop(event, position)}
                                onDragOver={handleDragOver}
                            >
                                {field[position] ? field[position]?.short : position}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Liste */}
                <div className="player-list">
                    <h2>Spielerliste</h2>

                    <div style={{ marginBottom: "10px" }}>
                        <label style={{ marginRight: "10px" }}>Position filtern:</label>
                        <select
                            value={selectedPosition}
                            onChange={(e) => setSelectedPosition(e.target.value)}
                        >
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
                            .filter(player => selectedPosition === "Alle" || player.position === selectedPosition)
                            .map((player, index) => {
                                const isAssigned = assignedPlayers.has(player.short);

                                return (
                                    <tr
                                        key={index}
                                        draggable={!isAssigned}
                                        onDragStart={(event) => !isAssigned && handleDragStart(event, player)}
                                        style={{
                                            opacity: isAssigned ? 0.5 : 1,
                                            cursor: isAssigned ? "not-allowed" : "grab",
                                        }}
                                    >
                                        <td>{player.rating}</td>
                                        <td>{player.short}</td>
                                        <td>{player.firstname}</td>
                                        <td>{player.lastname}</td>
                                        <td>{player.position}</td>
                                        <td>{player.age}</td>
                                        <td>{player.value}</td>
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
