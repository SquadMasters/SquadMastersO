import { useState } from "react";
import { Table } from "react-bootstrap";
import "./TeamBuild.css";

const TeamBuild = () => {
    const initialPlayers = [
        { rating: 84, firstname: "Thibaut", lastname: "Courtois", short: "TC", position: "TW", age: 32, value: "€25M" },
        { rating: 80, firstname: "Andriy", lastname: "Lunin", short: "AL", position: "TW", age: 26, value: "€20M" },
        { rating: 75, firstname: "Fran", lastname: "González", short: "FG", position: "TW", age: 19, value: "€0.4M" },
        { rating: 82, firstname: "Dani", lastname: "Carvajal", short: "DC", position: "RV", age: 33, value: "€8M" },
        { rating: 83, firstname: "Éder", lastname: "Militão", short: "EM", position: "IV", age: 27, value: "€40M" },
        { rating: 81, firstname: "David", lastname: "Alaba", short: "DA", position: "IV", age: 32, value: "€15M" },
        { rating: 84, firstname: "Antonio", lastname: "Rüdiger", short: "AR", position: "IV", age: 32, value: "€25M" },
        { rating: 79, firstname: "Ferland", lastname: "Mendy", short: "FM", position: "LV", age: 29, value: "€18M" },
        { rating: 78, firstname: "Lucas", lastname: "Vázquez", short: "LV", position: "RV", age: 33, value: "€5M" },
        { rating: 77, firstname: "Fran", lastname: "García", short: "FG", position: "LV", age: 25, value: "€10M" },
        { rating: 75, firstname: "Jesús", lastname: "Vallejo", short: "JV", position: "IV", age: 28, value: "€2M" },
        { rating: 86, firstname: "Jude", lastname: "Bellingham", short: "JB", position: "ZM", age: 21, value: "€120M" },
        { rating: 84, firstname: "Federico", lastname: "Valverde", short: "FV", position: "ZM", age: 26, value: "€90M" },
        { rating: 83, firstname: "Eduardo", lastname: "Camavinga", short: "EC", position: "ZM", age: 21, value: "€70M" },
        { rating: 83, firstname: "Aurélien", lastname: "Tchouaméni", short: "AT", position: "ZM", age: 24, value: "€80M" },
        { rating: 80, firstname: "Luka", lastname: "Modrić", short: "LM", position: "ZM", age: 39, value: "€3M" },
        { rating: 78, firstname: "Dani", lastname: "Ceballos", short: "DC", position: "ZM", age: 28, value: "€15M" },
        { rating: 77, firstname: "Arda", lastname: "Güler", short: "AG", position: "OM", age: 19, value: "€20M" },
        { rating: 88, firstname: "Kylian", lastname: "Mbappé", short: "KM", position: "ST", age: 25, value: "€180M" },
        { rating: 87, firstname: "Vinícius", lastname: "Júnior", short: "VJ", position: "LF", age: 24, value: "€150M" },
        { rating: 85, firstname: "Rodrygo", lastname: "Goes", short: "RG", position: "RF", age: 23, value: "€100M" },
        { rating: 78, firstname: "Brahim", lastname: "Díaz", short: "BD", position: "OM", age: 24, value: "€25M" },
        { rating: 77, firstname: "Endrick", lastname: "Felipe", short: "EF", position: "ST", age: 18, value: "€30M" },
    ];

    const fieldPositions = ["LAV", "IV1", "IV2", "RAV", "ZM1", "DZM", "ZM2", "LF", "ST", "RF", "TW"];
    const [players] = useState(initialPlayers);
    const [field, setField] = useState(fieldPositions.reduce((acc, pos) => ({ ...acc, [pos]: null }), {}));
    const [highlighted, setHighlighted] = useState<{ [key: string]: boolean }>({});
    const [assignedPlayers, setAssignedPlayers] = useState<Set<string>>(new Set());
    const [selectedPosition, setSelectedPosition] = useState("Alle");

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

        if (!allowedPositions.includes(position)) {
            return;
        }

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
        const total = Object.values(field)
            .filter(player => player !== null)
            .reduce((sum, player) => sum + (player?.rating || 0), 0);
        return Math.round(total);
    };

    const getTotalValue = () => {
        const total = Object.values(field)
            .filter(player => player !== null)
            .reduce((sum, player) => {
                if (!player?.value) return sum;
                const valueString = player.value.replace(/[^0-9.]/g, "").replace("M", "");
                return sum + parseFloat(valueString);
            }, 0);

        return `€${total}M`;
    };

    return (
        <div className="teambuild-container">
            <h1 className="teambuild-title">TeamBuild</h1>

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
